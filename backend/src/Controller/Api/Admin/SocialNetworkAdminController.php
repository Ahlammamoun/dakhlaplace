<?php

namespace App\Controller\Api\Admin;

use App\Entity\SocialNetwork;
use App\Repository\SocialNetworkRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/social-networks')]
final class SocialNetworkAdminController extends AbstractController
{
    private const ALLOWED_PLATFORMS = [
        'instagram',
        'facebook',
        'youtube',
        'tiktok',
        'x',
    ];

    #[Route(
        '',
        name: 'api_admin_social_network_index',
        methods: ['GET']
    )]
    public function index(
        SocialNetworkRepository $repository
    ): JsonResponse {
        $networks = $repository->findBy(
            [],
            ['position' => 'ASC']
        );

        return $this->json([
            'success' => true,
            'items' => array_map(
                fn (SocialNetwork $network): array =>
                    $this->normalize($network),
                $networks
            ),
        ]);
    }

    #[Route(
        '',
        name: 'api_admin_social_network_create',
        methods: ['POST']
    )]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (\Throwable) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Les données envoyées sont invalides.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $validationError = $this->validateData($data);

        if ($validationError !== null) {
            return $validationError;
        }

        $network = (new SocialNetwork())
            ->setName(trim($data['name']))
            ->setPlatform(trim($data['platform']))
            ->setUrl(trim($data['url']))
            ->setPosition(
                max(0, (int) ($data['position'] ?? 0))
            )
            ->setIsActive(
                (bool) ($data['isActive'] ?? true)
            );

        $entityManager->persist($network);
        $entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'message' => 'Réseau social ajouté.',
                'item' => $this->normalize($network),
            ],
            Response::HTTP_CREATED
        );
    }

    #[Route(
        '/{id}',
        name: 'api_admin_social_network_update',
        requirements: ['id' => '\d+'],
        methods: ['PATCH']
    )]
    public function update(
        SocialNetwork $network,
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (\Throwable) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Les données envoyées sont invalides.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $mergedData = [
            'name' =>
                $data['name'] ?? $network->getName(),
            'platform' =>
                $data['platform'] ??
                $network->getPlatform(),
            'url' =>
                $data['url'] ?? $network->getUrl(),
        ];

        $validationError =
            $this->validateData($mergedData);

        if ($validationError !== null) {
            return $validationError;
        }

        $network
            ->setName(trim($mergedData['name']))
            ->setPlatform(
                trim($mergedData['platform'])
            )
            ->setUrl(trim($mergedData['url']));

        if (array_key_exists('position', $data)) {
            $network->setPosition(
                max(0, (int) $data['position'])
            );
        }

        if (array_key_exists('isActive', $data)) {
            $network->setIsActive(
                (bool) $data['isActive']
            );
        }

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Réseau social modifié.',
            'item' => $this->normalize($network),
        ]);
    }

    #[Route(
        '/{id}',
        name: 'api_admin_social_network_delete',
        requirements: ['id' => '\d+'],
        methods: ['DELETE']
    )]
    public function delete(
        SocialNetwork $network,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $entityManager->remove($network);
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => 'Réseau social supprimé.',
        ]);
    }

    private function validateData(
        array $data
    ): ?JsonResponse {
        $name = trim(
            (string) ($data['name'] ?? '')
        );
        $platform = strtolower(
            trim((string) ($data['platform'] ?? ''))
        );
        $url = trim(
            (string) ($data['url'] ?? '')
        );

        if ($name === '' || $url === '') {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Le nom et l’URL sont obligatoires.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (
            !in_array(
                $platform,
                self::ALLOWED_PLATFORMS,
                true
            )
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'La plateforme est invalide.',
                    'allowedPlatforms' =>
                        self::ALLOWED_PLATFORMS,
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (
            !filter_var(
                $url,
                FILTER_VALIDATE_URL
            ) ||
            !in_array(
                parse_url($url, PHP_URL_SCHEME),
                ['http', 'https'],
                true
            )
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Veuillez saisir une URL valide.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (
            mb_strlen($name) > 100 ||
            mb_strlen($url) > 500
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Le nom ou l’URL est trop long.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        return null;
    }

    private function normalize(
        SocialNetwork $network
    ): array {
        return [
            'id' => $network->getId(),
            'name' => $network->getName(),
            'platform' => $network->getPlatform(),
            'url' => $network->getUrl(),
            'position' => $network->getPosition(),
            'isActive' => $network->isActive(),
            'createdAt' =>
                $network
                    ->getCreatedAt()
                    ->format(DATE_ATOM),
        ];
    }
}