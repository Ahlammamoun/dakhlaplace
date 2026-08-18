<?php

namespace App\Controller;

use App\Repository\ContentItemRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SitemapController extends AbstractController
{
    #[Route(
        '/sitemap.xml',
        name: 'app_sitemap',
        methods: ['GET']
    )]
    public function index(
        ContentItemRepository $repository
    ): Response {
        $staticUrls = [
            '/',
            '/decouvrir-dakhla',
            '/activites',
            '/hebergements',
            '/restaurants',
            '/magazine',
            '/carte-dakhla',
            '/a-propos',
            '/contact',
            '/espace-professionnels',
        ];

        $articles = $repository
            ->createQueryBuilder('contentItem')
            ->andWhere(
                'contentItem.isPublished = :published'
            )
            ->andWhere(
                'contentItem.type = :type'
            )
            ->setParameter('published', true)
            ->setParameter('type', 'article')
            ->orderBy(
                'contentItem.createdAt',
                'DESC'
            )
            ->getQuery()
            ->getResult();

        $baseUrl = 'https://dakhlaplace.com';

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        $xml .= "\n";

        foreach ($staticUrls as $path) {
            $priority = match ($path) {
                '/' => '1.0',
                '/decouvrir-dakhla',
                '/activites',
                '/hebergements',
                '/restaurants',
                '/magazine' => '0.9',
                '/carte-dakhla' => '0.8',
                '/a-propos' => '0.6',
                default => '0.5',
            };

            $xml .= "  <url>\n";
            $xml .= '    <loc>' .
                htmlspecialchars(
                    $baseUrl . $path,
                    ENT_XML1
                ) .
                "</loc>\n";
            $xml .= "    <priority>{$priority}</priority>\n";
            $xml .= "  </url>\n";
        }

        foreach ($articles as $article) {
            $url =
                $baseUrl .
                '/magazine/' .
                $article->getSlug();

            $xml .= "  <url>\n";
            $xml .= '    <loc>' .
                htmlspecialchars(
                    $url,
                    ENT_XML1
                ) .
                "</loc>\n";

            if ($article->getCreatedAt()) {
                $xml .= '    <lastmod>' .
                    $article
                    ->getCreatedAt()
                    ->format('Y-m-d') .
                    "</lastmod>\n";
            }

            $xml .= "    <priority>0.8</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';
        $response = new Response(
            $xml,
            Response::HTTP_OK,
            [
                'Content-Type' =>
                'application/xml; charset=UTF-8',
            ]
        );

        $response->headers->remove('X-Robots-Tag');

        return $response;
    }
}
