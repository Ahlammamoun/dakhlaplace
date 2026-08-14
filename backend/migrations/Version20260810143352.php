<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260810143352 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE content_image (id INT AUTO_INCREMENT NOT NULL, file_name VARCHAR(255) NOT NULL, alt_text VARCHAR(255) DEFAULT NULL, caption VARCHAR(255) DEFAULT NULL, is_main TINYINT NOT NULL, position INT NOT NULL, content_item_id INT NOT NULL, INDEX IDX_2EFE508DCD678BED (content_item_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE content_item (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, subtitle VARCHAR(255) DEFAULT NULL, excerpt LONGTEXT DEFAULT NULL, content LONGTEXT DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, phone VARCHAR(50) DEFAULT NULL, website_url VARCHAR(500) DEFAULT NULL, latitude NUMERIC(10, 7) DEFAULT NULL, longitude NUMERIC(10, 7) DEFAULT NULL, is_featured TINYINT NOT NULL, is_published TINYINT NOT NULL, position INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_D279C8DB989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE content_image ADD CONSTRAINT FK_2EFE508DCD678BED FOREIGN KEY (content_item_id) REFERENCES content_item (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE content_image DROP FOREIGN KEY FK_2EFE508DCD678BED');
        $this->addSql('DROP TABLE content_image');
        $this->addSql('DROP TABLE content_item');
    }
}
