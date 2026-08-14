<?php

namespace App\Controller\Api;

use App\Entity\ContentItem;
use App\Repository\ContentItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/content')]
final class ContentController extends AbstractController
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
        name: 'api_content_index',
        methods: ['GET']
    )]
    public function index(
        Request $request,
        ContentItemRepository $repository
    ): JsonResponse {
        $type = $request->query->get('type');

        if (
            $type !== null &&
            !in_array(
                $type,
                self::ALLOWED_TYPES,
                true
            )
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'Type de contenu invalide.',
                ],
                400
            );
        }

        $queryBuilder = $repository
            ->createQueryBuilder('contentItem')
            ->andWhere(
                'contentItem.isPublished = :published'
            )
            ->setParameter('published', true)
            ->orderBy(
                'contentItem.position',
                'ASC'
            )
            ->addOrderBy(
                'contentItem.createdAt',
                'DESC'
            );

        if ($type !== null) {
            $queryBuilder
                ->andWhere(
                    'contentItem.type = :type'
                )
                ->setParameter('type', $type);
        }

        if (
            $request->query->getBoolean(
                'featured'
            )
        ) {
            $queryBuilder->andWhere(
                'contentItem.isFeatured = true'
            );
        }

        $items = array_map(
            fn(ContentItem $item): array =>
            $this->normalize($item),
            $queryBuilder->getQuery()->getResult()
        );

        return $this->json([
            'success' => true,
            'items' => $items,
        ]);
    }

    #[Route(
        '/{slug}',
        name: 'api_content_show',
        methods: ['GET']
    )]
    public function show(
        string $slug,
        ContentItemRepository $repository
    ): JsonResponse {
        $item = $repository->findOneBy([
            'slug' => $slug,
            'isPublished' => true,
        ]);

        if (!$item instanceof ContentItem) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                    'Contenu introuvable.',
                ],
                404
            );
        }

        return $this->json([
            'success' => true,
            'item' => $this->normalize($item),
        ]);
    }

    private function normalize(
        ContentItem $item
    ): array {
        $images = [];

        foreach ($item->getImages() as $image) {
            $images[] = [
                'id' => $image->getId(),
                'url' =>
                '/uploads/content/' .
                    $image->getFileName(),
                'altText' =>
                $image->getAltText(),
                'caption' =>
                $image->getCaption(),
                'isMain' =>
                $image->isMain(),
                'position' =>
                $image->getPosition(),
            ];
        }

        return [
            'id' => $item->getId(),
            'title' => $item->getTitle(),
            'slug' => $item->getSlug(),
            'type' => $item->getType(),
            'subtitle' =>
            $item->getSubtitle(),
            'excerpt' =>
            $item->getExcerpt(),
            'content' =>
            $item->getContent(),
            'address' =>
            $item->getAddress(),
            'phone' => $item->getPhone(),
            'websiteUrl' =>
            $item->getWebsiteUrl(),
            'latitude' =>
            $item->getLatitude(),
            'longitude' =>
            $item->getLongitude(),
            'isFeatured' =>
            $item->isFeatured(),
            'position' =>
            $item->getPosition(),
            'images' => $images,
        ];
    }
}
