<?php

namespace App\Controller\Api\Admin;

use App\Entity\ContentItem;
use App\Repository\ContentItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/admin/content')]
final class ContentAdminController extends AbstractController
{
    private const ALLOWED_TYPES = [
        'place',
        'activity',
        'accommodation',
        'restaurant',
        'article',
    ];
    
    #[Route(
        '',
        name: 'api_admin_content_index',
        methods: ['GET']
    )]
    public function index(
        ContentItemRepository $repository
    ): JsonResponse {
        $contents = $repository->findBy(
            [],
            [
                'position' => 'ASC',
                'createdAt' => 'DESC',
            ]
        );

        $items = array_map(
            fn(ContentItem $content): array =>
            $this->normalizeContent($content),
            $contents
        );

        return $this->json([
            'success' => true,
            'items' => $items,
        ]);
    }


    #[Route(
        '/{id}',
        name: 'api_admin_content_show',
        requirements: ['id' => '\d+'],
        methods: ['GET']
    )]
    public function show(
        ContentItem $content
    ): JsonResponse {
        return $this->json([
            'success' => true,
            'item' => $this->normalizeContent($content),
        ]);
    }








    #[Route(
        '',
        name: 'api_admin_content_create',
        methods: ['POST']
    )]
    public function create(
        Request $request,
        ContentItemRepository $repository,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (\Throwable) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Le JSON envoyé est invalide.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $title = trim((string) ($data['title'] ?? ''));
        $type = trim((string) ($data['type'] ?? ''));

        if ($title === '') {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Le titre est obligatoire.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (!in_array($type, self::ALLOWED_TYPES, true)) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Le type de contenu est invalide.',
                    'allowedTypes' => self::ALLOWED_TYPES,
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $requestedSlug = trim(
            (string) ($data['slug'] ?? $title)
        );

        $slug = strtolower(
            $slugger->slug($requestedSlug)->toString()
        );

        if ($slug === '') {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Impossible de générer le slug.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if ($repository->findOneBy(['slug' => $slug])) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Ce slug existe déjà.',
                ],
                Response::HTTP_CONFLICT
            );
        }

        $latitude = $this->normalizeCoordinate(
            $data['latitude'] ?? null,
            -90,
            90
        );

        if ($latitude === false) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'La latitude doit être un nombre compris entre -90 et 90.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $longitude = $this->normalizeCoordinate(
            $data['longitude'] ?? null,
            -180,
            180
        );

        if ($longitude === false) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'La longitude doit être un nombre compris entre -180 et 180.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $content = new ContentItem();

        $content
            ->setTitle($title)
            ->setSlug($slug)
            ->setType($type)
            ->setSubtitle(
                $this->nullableString($data['subtitle'] ?? null)
            )
            ->setExcerpt(
                $this->nullableString($data['excerpt'] ?? null)
            )
            ->setContent(
                $this->nullableString($data['content'] ?? null)
            )
            ->setAddress(
                $this->nullableString($data['address'] ?? null)
            )
            ->setPhone(
                $this->nullableString($data['phone'] ?? null)
            )
            ->setWebsiteUrl(
                $this->nullableString($data['websiteUrl'] ?? null)
            )
            ->setLatitude($latitude)
            ->setLongitude($longitude)
            ->setIsFeatured(
                (bool) ($data['isFeatured'] ?? false)
            )
            ->setIsPublished(
                (bool) ($data['isPublished'] ?? false)
            )
            ->setPosition(
                max(0, (int) ($data['position'] ?? 0))
            );

        $entityManager->persist($content);
        $entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Contenu créé avec succès.',
                'item' => $this->normalizeContent($content),
            ],
            Response::HTTP_CREATED
        );
    }
    #[Route(
        '/{id}',
        name: 'api_admin_content_update',
        requirements: ['id' => '\d+'],
        methods: ['PATCH']
    )]
    public function update(
        ContentItem $content,
        Request $request,
        ContentItemRepository $repository,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (\Throwable) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Le JSON envoyé est invalide.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        if (array_key_exists('title', $data)) {
            $title = trim((string) $data['title']);

            if ($title === '') {
                return $this->json(
                    [
                        'success' => false,
                        'message' => 'Le titre ne peut pas être vide.',
                    ],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            $content->setTitle($title);
        }

        if (array_key_exists('slug', $data)) {
            $slug = strtolower(
                $slugger
                    ->slug((string) $data['slug'])
                    ->toString()
            );

            if ($slug === '') {
                return $this->json(
                    [
                        'success' => false,
                        'message' => 'Le slug est invalide.',
                    ],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            $existingContent = $repository->findOneBy([
                'slug' => $slug,
            ]);

            if (
                $existingContent
                && $existingContent->getId() !== $content->getId()
            ) {
                return $this->json(
                    [
                        'success' => false,
                        'message' => 'Ce slug existe déjà.',
                    ],
                    Response::HTTP_CONFLICT
                );
            }

            $content->setSlug($slug);
        }

        if (array_key_exists('type', $data)) {
            $type = trim((string) $data['type']);

            if (!in_array($type, self::ALLOWED_TYPES, true)) {
                return $this->json(
                    [
                        'success' => false,
                        'message' => 'Le type est invalide.',
                        'allowedTypes' => self::ALLOWED_TYPES,
                    ],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            $content->setType($type);
        }

        $nullableFields = [
            'subtitle' => 'setSubtitle',
            'excerpt' => 'setExcerpt',
            'content' => 'setContent',
            'address' => 'setAddress',
            'phone' => 'setPhone',
            'websiteUrl' => 'setWebsiteUrl',
        ];

        foreach ($nullableFields as $field => $setter) {
            if (array_key_exists($field, $data)) {
                $content->{$setter}(
                    $this->nullableString($data[$field])
                );
            }
        }

        if (array_key_exists('latitude', $data)) {
            $latitude = $this->normalizeCoordinate(
                $data['latitude'],
                -90,
                90
            );

            if ($latitude === false) {
                return $this->json(
                    [
                        'success' => false,
                        'message' =>
                        'La latitude doit être un nombre compris entre -90 et 90.',
                    ],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            $content->setLatitude($latitude);
        }

        if (array_key_exists('longitude', $data)) {
            $longitude = $this->normalizeCoordinate(
                $data['longitude'],
                -180,
                180
            );

            if ($longitude === false) {
                return $this->json(
                    [
                        'success' => false,
                        'message' =>
                        'La longitude doit être un nombre compris entre -180 et 180.',
                    ],
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }

            $content->setLongitude($longitude);
        }

        if (array_key_exists('isFeatured', $data)) {
            $content->setIsFeatured(
                (bool) $data['isFeatured']
            );
        }

        if (array_key_exists('isPublished', $data)) {
            $content->setIsPublished(
                (bool) $data['isPublished']
            );
        }

        if (array_key_exists('position', $data)) {
            $content->setPosition(
                max(0, (int) $data['position'])
            );
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Contenu modifié avec succès.',
            'item' => $this->normalizeContent($content),
        ]);
    }


    #[Route(
        '/{id}',
        name: 'api_admin_content_delete',
        requirements: ['id' => '\d+'],
        methods: ['DELETE']
    )]
    public function delete(
        ContentItem $content,
        EntityManagerInterface $entityManager,
        \Symfony\Component\HttpKernel\KernelInterface $kernel
    ): JsonResponse {
        $uploadDirectory =
            $kernel->getProjectDir() . '/public/uploads/content';

        foreach ($content->getImages() as $image) {
            $filePath =
                $uploadDirectory . '/' . $image->getFileName();

            if (is_file($filePath)) {
                @unlink($filePath);
            }
        }

        $entityManager->remove($content);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Contenu supprimé avec succès.',
        ]);
    }
    private function normalizeContent(
        ContentItem $content
    ): array {
        return [
            'id' => $content->getId(),
            'title' => $content->getTitle(),
            'slug' => $content->getSlug(),
            'type' => $content->getType(),
            'subtitle' => $content->getSubtitle(),
            'excerpt' => $content->getExcerpt(),
            'content' => $content->getContent(),
            'address' => $content->getAddress(),
            'phone' => $content->getPhone(),
            'websiteUrl' => $content->getWebsiteUrl(),
            'latitude' => $content->getLatitude(),
            'longitude' => $content->getLongitude(),
            'isFeatured' => $content->isFeatured(),
            'isPublished' => $content->isPublished(),
            'position' => $content->getPosition(),
            'imagesCount' => $content->getImages()->count(),
            'images' => array_map(
                static fn($image): array => [
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
                $content->getImages()->toArray()
            ),
            'createdAt' =>
            $content->getCreatedAt()?->format(DATE_ATOM),
            'updatedAt' =>
            $content->getUpdatedAt()?->format(DATE_ATOM),
        ];
    }

    private function nullableString(mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private function normalizeCoordinate(
        mixed $value,
        float $minimum,
        float $maximum
    ): string|false|null {
        if ($value === null || $value === '') {
            return null;
        }

        if (!is_int($value) && !is_float($value) && !is_string($value)) {
            return false;
        }

        $value = trim((string) $value);

        if ($value === '' || !is_numeric($value)) {
            return $value === '' ? null : false;
        }

        $number = (float) $value;

        if ($number < $minimum || $number > $maximum) {
            return false;
        }

        return $value;
    }
}
