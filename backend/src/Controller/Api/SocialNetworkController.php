<?php

namespace App\Controller\Api;

use App\Entity\SocialNetwork;
use App\Repository\SocialNetworkRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/social-networks')]
final class SocialNetworkController extends AbstractController
{
    #[Route(
        '',
        name: 'api_social_network_index',
        methods: ['GET']
    )]
    public function index(
        SocialNetworkRepository $repository
    ): JsonResponse {
        $networks = $repository->findBy(
            ['isActive' => true],
            ['position' => 'ASC']
        );

        return $this->json([
            'success' => true,
            'items' => array_map(
                static fn (
                    SocialNetwork $network
                ): array => [
                    'id' => $network->getId(),
                    'name' => $network->getName(),
                    'platform' =>
                        $network->getPlatform(),
                    'url' => $network->getUrl(),
                    'position' =>
                        $network->getPosition(),
                ],
                $networks
            ),
        ]);
    }
}