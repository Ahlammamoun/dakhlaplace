import {
  useEffect,
  useState,
} from "react";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Seo from "../components/Seo";
import { getPublicContents } from "../services/api";
import lagoonImage from "../assets/lagune-dakhla.jpg";

function getMainImage(article) {
  return (
    article.images?.find((image) => image.isMain) ??
    article.images?.[0] ??
    null
  );
}

function getReadingTime(content) {
  const words = content
    ? content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

  return Math.max(1, Math.ceil(words / 200));
}

export default function MagazinePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getPublicContents({
          type: "article",
        });

        setArticles(data.items ?? []);
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
    <>
      <Seo
        title="Magazine Dakhla : voyage, conseils et découvertes"
        description="Découvrez nos guides et articles sur Dakhla au Maroc : activités, gastronomie, météo, conseils de voyage, lieux à visiter et idées pour préparer votre séjour."
        path="/magazine"
        image={lagoonImage}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Magazine DakhlaPlace",
          url: "https://dakhlaplace.com/magazine",
          description:
            "Guides, conseils et articles pour découvrir Dakhla au Maroc et préparer son séjour.",
          isPartOf: {
            "@type": "WebSite",
            name: "DakhlaPlace",
            url: "https://dakhlaplace.com/",
          },
          about: {
            "@type": "Place",
            name: "Dakhla",
            address: {
              "@type": "PostalAddress",
              addressCountry: "MA",
            },
          },
        }}
      />

      <main className="inner-page">
        <section
          className="inner-hero magazine-page-hero"
          style={{
            backgroundImage: `url(${lagoonImage})`,
          }}
        >
          <div className="inner-hero-overlay" />

          <Header />

          <div className="inner-hero-content">
            <span>
              <BookOpen size={17} />
              Histoires et inspirations
            </span>

            <h1>Le magazine DakhlaPlace</h1>

            <p>
              Conseils, découvertes et récits pour mieux
              connaître Dakhla et préparer votre prochain
              séjour.
            </p>
          </div>
        </section>

        <section className="magazine-page-introduction">
          <span className="section-label">
            Explorer autrement
          </span>

          <h2>Nos derniers articles</h2>

          <p>
            Retrouvez nos guides pratiques et nos idées
            pour découvrir les paysages, les activités et
            les saveurs de Dakhla.
          </p>
        </section>

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

        {!loading &&
          !error &&
          articles.length === 0 && (
            <div className="public-content-state">
              Aucun article publié pour le moment.
            </div>
          )}

        {!loading &&
          !error &&
          articles.length > 0 && (
            <section className="magazine-page-grid">
              {articles.map((article) => {
                const image = getMainImage(article);
                const readingTime = getReadingTime(
                  article.content
                );

                return (
                  <article
                    className="magazine-page-card"
                    key={article.id}
                  >
                    <Link
                      to={`/magazine/${article.slug}`}
                      className="magazine-page-card-image"
                    >
                      {image ? (
                        <img
                          src={image.url}
                          alt={
                            image.altText ??
                            article.title
                          }
                        />
                      ) : (
                        <div className="public-image-empty">
                          <BookOpen size={32} />
                        </div>
                      )}

                      <span>
                        {article.subtitle ??
                          "Découverte"}
                      </span>
                    </Link>

                    <div className="magazine-page-card-content">
                      <div className="magazine-page-meta">
                        <span>
                          {readingTime} min de lecture
                        </span>

                        <span>DakhlaPlace</span>
                      </div>

                      <h2>
                        <Link
                          to={`/magazine/${article.slug}`}
                        >
                          {article.title}
                        </Link>
                      </h2>

                      {article.excerpt && (
                        <p>{article.excerpt}</p>
                      )}

                      <Link
                        to={`/magazine/${article.slug}`}
                        className="magazine-page-read"
                      >
                        Lire l’article
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

        <Footer />
        <BackToTopButton />
      </main>
    </>
  );
}