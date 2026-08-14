import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { getPublicContents } from "../services/api";

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

export default function Magazine() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        let data = await getPublicContents({
          type: "article",
          featured: true,
        });

        let items = data.items ?? [];

        /*
         * Si aucun article n’est mis en avant,
         * on affiche les premiers articles publiés.
         */
        if (items.length === 0) {
          data = await getPublicContents({
            type: "article",
          });

          items = data.items ?? [];
        }

        setArticles(items.slice(0, 3));
      } catch (requestError) {
        setError(
          requestError.message ??
            "Impossible de charger les articles."
        );
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <section id="stories" className="magazine-section">
      <div className="magazine-heading">
        <div>
          <span className="section-label">
            Le magazine
          </span>

          <h2>Conseils et inspirations</h2>
        </div>

        <Link
          to="/magazine"
          className="magazine-all-link"
        >
          Voir tous les articles
          <ArrowRight size={19} />
        </Link>
      </div>

      {loading && (
        <div className="public-content-state">
          Chargement des articles…
        </div>
      )}

      {error && (
        <div className="public-content-state error">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="public-content-state">
          Aucun article publié pour le moment.
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="magazine-grid">
          {articles.map((article, index) => {
            const image = getMainImage(article);
            const readingTime = getReadingTime(
              article.content
            );

            return (
              <article
                className={`article-card ${
                  index === 0
                    ? "article-card-featured"
                    : ""
                }`}
                key={article.id}
              >
                <Link
                  to={`/magazine/${article.slug}`}
                  className="article-image"
                >
                  {image && (
                    <img
                      src={image.url}
                      alt={
                        image.altText ??
                        article.title
                      }
                    />
                  )}

                  <span className="article-category">
                    {article.subtitle ?? "Découverte"}
                  </span>
                </Link>

                <div className="article-content">
                  <div className="article-meta">
                    <span>
                      {readingTime} min de lecture
                    </span>

                    <span>Dakhla Place</span>
                  </div>

                  <h3>
                    <Link
                      to={`/magazine/${article.slug}`}
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {article.excerpt && (
                    <p>{article.excerpt}</p>
                  )}

                  <Link
                    to={`/magazine/${article.slug}`}
                    className="article-read-link"
                  >
                    Lire l’article
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}