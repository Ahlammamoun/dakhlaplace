<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AppFixtures extends Fixture
{
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(
        ObjectManager $manager
    ): void {
        $email = $_ENV['ADMIN_EMAIL'] ?? null;
        $plainPassword =
            $_ENV['ADMIN_PASSWORD'] ?? null;

        if (
            !is_string($email) ||
            $email === '' ||
            !is_string($plainPassword) ||
            $plainPassword === ''
        ) {
            throw new \RuntimeException(
                'ADMIN_EMAIL et ADMIN_PASSWORD doivent être configurés.'
            );
        }

        $admin = new User();
        $admin->setEmail($email);
        $admin->setRoles([
            'ROLE_ADMIN',
        ]);

        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                $plainPassword
            )
        );

        $manager->persist($admin);
        $manager->flush();
    }
}
