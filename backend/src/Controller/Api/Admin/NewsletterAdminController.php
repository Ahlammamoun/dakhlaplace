<?php

namespace App\Controller\Api\Admin;

use App\Entity\NewsletterSubscriber;
use App\Repository\NewsletterSubscriberRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/newsletter')]
final class NewsletterAdminController extends AbstractController
{
    #[Route(
        '',
        name: 'api_admin_newsletter_index',
        methods: ['GET']
    )]
    public function index(
        NewsletterSubscriberRepository $repository
    ): JsonResponse {
        $subscribers = $repository->findBy(
            [],
            ['createdAt' => 'DESC']
        );

        $items = array_map(
            fn (NewsletterSubscriber $subscriber): array =>
                $this->normalize($subscriber),
            $subscribers
        );

        return $this->json([
            'success' => true,
            'items' => $items,
            'statistics' => [
                'total' => count($items),
                'active' => count(
                    array_filter(
                        $items,
                        static fn (array $item): bool =>
                            $item['isActive']
                    )
                ),
                'inactive' => count(
                    array_filter(
                        $items,
                        static fn (array $item): bool =>
                            !$item['isActive']
                    )
                ),
            ],
        ]);
    }

    #[Route(
        '/{id}/toggle',
        name: 'api_admin_newsletter_toggle',
        requirements: ['id' => '\d+'],
        methods: ['PATCH']
    )]
    public function toggle(
        NewsletterSubscriber $subscriber,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $isActive = !$subscriber->isActive();

        $subscriber
            ->setIsActive($isActive)
            ->setUnsubscribedAt(
                $isActive
                    ? null
                    : new \DateTimeImmutable()
            );

        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => $isActive
                ? 'Abonnement réactivé.'
                : 'Abonnement désactivé.',
            'item' => $this->normalize($subscriber),
        ]);
    }

    private function normalize(
        NewsletterSubscriber $subscriber
    ): array {
        return [
            'id' => $subscriber->getId(),
            'email' => $subscriber->getEmail(),
            'isActive' => $subscriber->isActive(),
            'createdAt' =>
                $subscriber
                    ->getCreatedAt()
                    ->format(DATE_ATOM),
            'unsubscribedAt' =>
                $subscriber
                    ->getUnsubscribedAt()
                    ?->format(DATE_ATOM),
        ];
    }
}