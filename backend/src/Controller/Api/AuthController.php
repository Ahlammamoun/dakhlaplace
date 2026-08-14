<?php

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AuthController extends AbstractController
{
    #[Route(
        '/api/login',
        name: 'api_login',
        methods: ['POST']
    )]
    public function login(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Identifiants invalides.',
                ],
                401
            );
        }

        return $this->json([
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route(
        '/api/me',
        name: 'api_me',
        methods: ['GET']
    )]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Authentification requise.',
                ],
                401
            );
        }

        return $this->json([
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ],
        ]);
    }

    #[Route(
        '/api/logout',
        name: 'api_logout',
        methods: ['POST']
    )]
    public function logout(): never
    {
        throw new \LogicException(
            'Cette méthode est interceptée par Symfony.'
        );
    }
}
