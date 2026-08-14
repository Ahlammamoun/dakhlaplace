<?php

namespace App\Controller\Api;

use App\Entity\ContactMessage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/contact')]
final class ContactController extends AbstractController
{
    #[Route(
        '',
        name: 'api_contact_create',
        methods: ['POST']
    )]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
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

        $firstname = trim(
            (string) ($data['firstname'] ?? '')
        );
        $lastname = trim(
            (string) ($data['lastname'] ?? '')
        );
        $email = strtolower(
            trim((string) ($data['email'] ?? ''))
        );
        $subject = trim(
            (string) ($data['subject'] ?? '')
        );
        $message = trim(
            (string) ($data['message'] ?? '')
        );

        if (
            $firstname === '' ||
            $email === '' ||
            $subject === '' ||
            $message === ''
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Veuillez remplir tous les champs obligatoires.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $emailViolations = $validator->validate(
            $email,
            [
                new Email(
                    message:
                        'Veuillez saisir une adresse e-mail valide.'
                ),
            ]
        );

        if (count($emailViolations) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        (string) $emailViolations[0]
                            ->getMessage(),
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (
            mb_strlen($firstname) > 100 ||
            mb_strlen($lastname) > 100 ||
            mb_strlen($email) > 180 ||
            mb_strlen($subject) > 255
        ) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Un ou plusieurs champs sont trop longs.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (mb_strlen($message) < 10) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Votre message doit contenir au moins 10 caractères.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if (mb_strlen($message) > 5000) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Votre message ne peut pas dépasser 5 000 caractères.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $contactMessage = (new ContactMessage())
            ->setFirstname($firstname)
            ->setLastname(
                $lastname !== '' ? $lastname : null
            )
            ->setEmail($email)
            ->setSubject($subject)
            ->setMessage($message);

        $entityManager->persist($contactMessage);
        $entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'message' =>
                    'Merci ! Votre message a bien été envoyé.',
            ],
            Response::HTTP_CREATED
        );
    }
}