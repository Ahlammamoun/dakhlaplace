<?php

namespace App\Controller\Api\Admin;

use App\Entity\ContentImage;
use App\Entity\ContentItem;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Repository\ContentImageRepository;

#[Route('/api/admin/content')]
final class ContentImageAdminController extends AbstractController
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif',
    ];

    #[Route(
        '/{id}/images',
        name: 'api_admin_content_image_create',
        requirements: ['id' => '\d+'],
        methods: ['POST']
    )]
    public function create(
        ContentItem $contentItem,
        Request $request,
        EntityManagerInterface $entityManager,
        KernelInterface $kernel,
        SluggerInterface $slugger
    ): JsonResponse {
        $file = $request->files->get('image');

        if (!$file instanceof UploadedFile) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Aucune image valide envoyée.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!$file->isValid()) {
            return $this->json(
                [
                    'success' => false,
                    'message' => $file->getErrorMessage(),
                    'uploadError' => $file->getError(),
                    'originalName' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (!in_array(
            $file->getMimeType(),
            self::ALLOWED_MIME_TYPES,
            true
        )) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'Format refusé. Utilisez JPG, PNG, WebP ou AVIF.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if ($file->getSize() > 8 * 1024 * 1024) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'L’image ne doit pas dépasser 8 Mo.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $uploadDirectory =
            $kernel->getProjectDir() . '/public/uploads/content';

        if (
            !is_dir($uploadDirectory)
            && !mkdir($uploadDirectory, 0775, true)
            && !is_dir($uploadDirectory)
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'Impossible de créer le dossier des images.',
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $originalName = pathinfo(
            $file->getClientOriginalName(),
            PATHINFO_FILENAME
        );

        $safeName = strtolower(
            $slugger->slug($originalName)->toString()
        );

        if ($safeName === '') {
            $safeName = 'image';
        }

        $extension =
            $file->guessExtension()
            ?: $file->getClientOriginalExtension()
            ?: 'jpg';

        $fileName = sprintf(
            '%s-%s.%s',
            $safeName,
            bin2hex(random_bytes(6)),
            strtolower($extension)
        );

        try {
            $file->move($uploadDirectory, $fileName);
        } catch (FileException) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'Impossible d’enregistrer cette image.',
                ],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }

        $isMain = filter_var(
            $request->request->get('isMain', false),
            FILTER_VALIDATE_BOOLEAN
        );

        if ($isMain) {
            foreach ($contentItem->getImages() as $existingImage) {
                $existingImage->setIsMain(false);
            }
        }

        $image = new ContentImage();

        $image
            ->setFileName($fileName)
            ->setAltText(
                $this->nullableString(
                    $request->request->get('altText')
                )
            )
            ->setCaption(
                $this->nullableString(
                    $request->request->get('caption')
                )
            )
            ->setIsMain($isMain)
            ->setPosition(
                max(
                    0,
                    (int) $request->request->get('position', 0)
                )
            )
            ->setContentItem($contentItem);

        $entityManager->persist($image);
        $entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Image ajoutée avec succès.',
                'item' => [
                    'id' => $image->getId(),
                    'fileName' => $image->getFileName(),
                    'url' =>
                    '/uploads/content/' .
                        $image->getFileName(),
                    'altText' => $image->getAltText(),
                    'caption' => $image->getCaption(),
                    'isMain' => $image->isMain(),
                    'position' => $image->getPosition(),
                ],
            ],
            Response::HTTP_CREATED
        );
    }

    #[Route(
        '/{contentId}/images/{imageId}',
        name: 'api_admin_content_image_delete',
        requirements: [
            'contentId' => '\d+',
            'imageId' => '\d+',
        ],
        methods: ['DELETE']
    )]
    public function delete(
        int $contentId,
        int $imageId,
        ContentImageRepository $repository,
        EntityManagerInterface $entityManager,
        KernelInterface $kernel
    ): JsonResponse {
        $image = $repository->find($imageId);

        if (
            !$image
            || $image->getContentItem()?->getId() !== $contentId
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Image introuvable.',
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        $filePath = sprintf(
            '%s/public/uploads/content/%s',
            $kernel->getProjectDir(),
            $image->getFileName()
        );

        $entityManager->remove($image);
        $entityManager->flush();

        if (is_file($filePath)) {
            @unlink($filePath);
        }

        return $this->json([
            'success' => true,
            'message' => 'Image supprimée avec succès.',
        ]);
    }


    private function nullableString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }
}
