import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Clock,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

import { getPublicContent } from "../services/api";

function getMainImage(article) {
  return (
    article.images?.find((image) => image.isMain) ??
    article.images?.[0] ??
    null
  );
}

function getReadingTime(content) {
  const words = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return Math.max(1, Math.ceil(words / 200));
}

function getParagraphs(content) {
  if (!content) {
    return [];
  }

  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function ArticlePage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError("");

      try {
        const data = await getPublicContent(slug);

        setArticle(data.item ?? null);
      } catch (requestError) {
        setError(
          requestError.status === 404
            ? "Cette histoire n’existe pas encore."
            : requestError.message ??
                "Impossible de charger l’article."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="article-not-found">
        <Header solid />

        <div>
          <span className="section-label">
            Le magazine
          </span>

          <h1>Chargement de l’article…</h1>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="article-not-found">
        <Header solid />

        <div>
          <span className="section-label">
            Article introuvable
          </span>

          <h1>
            {error ||
              "Cette histoire n’existe pas encore."}
          </h1>

          <Link to="/magazine">
            <ArrowLeft size={18} />
            Retour au magazine
          </Link>
        </div>
      </main>
    );
  }

  const image = getMainImage(article);
  const readingTime = getReadingTime(article.content);
  const paragraphs = getParagraphs(article.content);

  return (
    <main className="article-page">
      <Header solid />

      <article>
        <header className="article-page-header">
          <Link
            to="/magazine"
            className="article-back-link"
          >
            <ArrowLeft size={18} />
            Retour au magazine
          </Link>

          <span className="section-label">
            {article.subtitle ?? "Découverte"}
          </span>

          <h1>{article.title}</h1>

          {article.excerpt && (
            <p>{article.excerpt}</p>
          )}

          <div className="article-page-reading-time">
            <Clock size={16} />
            {readingTime} min de lecture
          </div>
        </header>

        {image && (
          <div className="article-page-cover">
            <img
              src={image.url}
              alt={
                image.altText ??
                article.title
              }
            />
          </div>
        )}

        <div className="article-page-body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p
                className={
                  index === 0
                    ? "article-lead"
                    : undefined
                }
                key={`${article.id}-${index}`}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="article-lead">
              Le contenu de cet article sera bientôt
              disponible.
            </p>
          )}
        </div>
      </article>

      <Footer />
      <BackToTopButton />
    </main>
  );
}