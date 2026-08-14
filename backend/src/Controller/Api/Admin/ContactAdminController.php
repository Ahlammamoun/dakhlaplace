<?php

namespace App\Controller\Api\Admin;

use App\Entity\ContactMessage;
use App\Repository\ContactMessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/admin/contact')]
final class ContactAdminController extends AbstractController
{
    #[Route(
        '',
        name: 'api_admin_contact_index',
        methods: ['GET']
    )]
    public function index(
        ContactMessageRepository $repository
    ): JsonResponse {
        $messages = $repository->findBy(
            [],
            ['createdAt' => 'DESC']
        );

        $items = array_map(
            fn (ContactMessage $message): array =>
                $this->normalize($message),
            $messages
        );

        return $this->json([
            'success' => true,
            'items' => $items,
            'statistics' => [
                'total' => count($items),
                'unread' => count(
                    array_filter(
                        $items,
                        static fn (array $item): bool =>
                            !$item['isRead']
                    )
                ),
                'read' => count(
                    array_filter(
                        $items,
                        static fn (array $item): bool =>
                            $item['isRead']
                    )
                ),
            ],
        ]);
    }

    #[Route(
        '/{id}',
        name: 'api_admin_contact_show',
        requirements: ['id' => '\d+'],
        methods: ['GET']
    )]
    public function show(
        ContactMessage $message,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        if (!$message->isRead()) {
            $message->setIsRead(true);
            $entityManager->flush();
        }

        return $this->json([
            'success' => true,
            'item' => $this->normalize($message),
        ]);
    }

    #[Route(
        '/{id}/toggle-read',
        name: 'api_admin_contact_toggle_read',
        requirements: ['id' => '\d+'],
        methods: ['PATCH']
    )]
    public function toggleRead(
        ContactMessage $message,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $message->setIsRead(!$message->isRead());
        $entityManager->flush();

        return $this->json([
            'success' => true,
            'message' => $message->isRead()
                ? 'Message marqué comme lu.'
                : 'Message marqué comme non lu.',
            'item' => $this->normalize($message),
        ]);
    }

    private function normalize(
        ContactMessage $message
    ): array {
        return [
            'id' => $message->getId(),
            'firstname' => $message->getFirstname(),
            'lastname' => $message->getLastname(),
            'email' => $message->getEmail(),
            'subject' => $message->getSubject(),
            'message' => $message->getMessage(),
            'isRead' => $message->isRead(),
            'createdAt' =>
                $message
                    ->getCreatedAt()
                    ->format(DATE_ATOM),
        ];
    }
}