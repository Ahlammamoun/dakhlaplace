<?php

namespace App\Controller\Api;

use App\Entity\NewsletterSubscriber;
use App\Repository\NewsletterSubscriberRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/newsletter')]
final class NewsletterController extends AbstractController
{
    #[Route(
        '/subscribe',
        name: 'api_newsletter_subscribe',
        methods: ['POST']
    )]
    public function subscribe(
        Request $request,
        NewsletterSubscriberRepository $repository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        try {
            $data = $request->toArray();
        } catch (\Throwable) {
            return $this->json(
                [
                    'success' => false,
                    'message' => 'Les données envoyées sont invalides.',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        $email = strtolower(
            trim((string) ($data['email'] ?? ''))
        );

        if ($email === '') {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        'Veuillez saisir votre adresse e-mail.',
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $violations = $validator->validate(
            $email,
            [
                new Email(
                    message:
                        'Veuillez saisir une adresse e-mail valide.'
                ),
            ]
        );

        if (count($violations) > 0) {
            return $this->json(
                [
                    'success' => false,
                    'message' =>
                        (string) $violations[0]->getMessage(),
                ],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $subscriber = $repository->findOneBy([
            'email' => $email,
        ]);

        if ($subscriber instanceof NewsletterSubscriber) {
            if ($subscriber->isActive()) {
                return $this->json([
                    'success' => true,
                    'alreadySubscribed' => true,
                    'message' =>
                        'Cette adresse est déjà inscrite à la newsletter.',
                ]);
            }

            $subscriber
                ->setIsActive(true)
                ->setUnsubscribedAt(null);

            $entityManager->flush();

            return $this->json([
                'success' => true,
                'message' =>
                    'Votre inscription a bien été réactivée.',
            ]);
        }

        $subscriber = (new NewsletterSubscriber())
            ->setEmail($email);

        $entityManager->persist($subscriber);
        $entityManager->flush();

        return $this->json(
            [
                'success' => true,
                'message' =>
                    'Merci ! Votre inscription a bien été enregistrée.',
            ],
            Response::HTTP_CREATED
        );
    }
}