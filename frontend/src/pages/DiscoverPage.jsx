import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getPublicContents } from "../services/api";
import Seo from "../components/Seo";
import whiteDuneImage from "../assets/dune-blanche.jpg";

function getMainImage(item) {
  return (
    item.images?.find((image) => image.isMain) ??
    item.images?.[0] ??
    null
  );
}

export default function DiscoverPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPublicContents({
          type: "place",
        });

        setPlaces(data.items ?? []);
      } catch (requestError) {
        setError(
          requestError.message ??
          "Impossible de charger les lieux."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, []);

  const featuredPlace = useMemo(
    () =>
      places.find((place) => place.isFeatured) ??
      places[0] ??
      null,
    [places]
  );

  const featuredImage = featuredPlace
    ? getMainImage(featuredPlace)
    : null;

  return (
    <>
      <Seo
        title="Que faire à Dakhla ? Les lieux incontournables"
        description="Découvrez les lieux incontournables de Dakhla au Maroc : lagune, Dune Blanche, plages, désert et paysages uniques entre océan Atlantique et Sahara."
        path="/decouvrir-dakhla"
        image={
          featuredImage?.url ??
          "/assets/dune-blanche.jpg"
        }
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Que faire à Dakhla ? Les lieux incontournables",
          url: "https://dakhlaplace.com/decouvrir-dakhla",
          description:
            "Découvrez les lieux incontournables de Dakhla au Maroc : lagune, Dune Blanche, plages, désert et paysages uniques.",
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
      <main>
        <Header />

        <section
          className="inner-hero"
          style={{
            backgroundImage: `url(${featuredImage?.url ?? whiteDuneImage
              })`,
          }}
        >
          <div className="inner-hero-overlay" />

          <div className="inner-hero-content">
            <span>
              <MapPin size={17} />
              Découvrez la destination
            </span>

            <h1>
              {featuredPlace?.title ??
                "Dakhla, entre lagune et immensité"}
            </h1>

            <p>
              {featuredPlace?.subtitle ??
                featuredPlace?.excerpt ??
                "Une ville singulière entre l’océan Atlantique, la lagune et le désert."}
            </p>
          </div>
        </section>

        <section className="discover-intro">
          <div>
            <span className="section-label">
              Bienvenue à Dakhla
            </span>

            <h2>
              Une destination façonnée par l’océan et le
              désert
            </h2>
          </div>

          <div className="discover-intro-text">
            <p>
              Située sur une longue péninsule, Dakhla offre
              un équilibre rare entre nature sauvage,
              culture locale et activités nautiques.
            </p>

            <p>
              Retrouvez ici les lieux publiés et mis à jour
              directement depuis l’administration
              DakhlaPlace.
            </p>
          </div>
        </section>

        <section className="discover-numbers">
          <div>
            <strong>25 °C</strong>
            <span>Température moyenne</span>
          </div>

          <div>
            <strong>250 km</strong>
            <span>De lagune et de littoral</span>
          </div>

          <div>
            <strong>300+</strong>
            <span>Jours de vent par an</span>
          </div>

          <div>
            <strong>4 saisons</strong>
            <span>Pour découvrir Dakhla</span>
          </div>
        </section>

        <section className="public-content-section">
          <div className="public-content-heading">
            <span className="section-label">
              Lieux incontournables
            </span>

            <h2>Explorez Dakhla</h2>

            <p>
              Lagune, désert, plages et sites naturels :
              préparez votre découverte de Dakhla.
            </p>
          </div>

          {loading && (
            <div className="public-content-state">
              Chargement des lieux…
            </div>
          )}

          {error && (
            <div className="public-content-state error">
              {error}
            </div>
          )}

          {!loading && !error && places.length === 0 && (
            <div className="public-content-state">
              Aucun lieu publié pour le moment.
            </div>
          )}

          {!loading && places.length > 0 && (
            <div className="public-content-grid">
              {places.map((place) => {
                const image = getMainImage(place);

                return (
                  <article
                    className="public-content-card"
                    key={place.id}
                  >
                    <div className="public-content-image">
                      {image ? (
                        <img
                          src={image.url}
                          alt={
                            image.altText ??
                            place.title
                          }
                        />
                      ) : (
                        <div className="public-image-empty">
                          <MapPin size={32} />
                        </div>
                      )}

                      {place.isFeatured && (
                        <span className="featured-badge">
                          Incontournable
                        </span>
                      )}
                    </div>

                    <div className="public-content-card-body">
                      <span className="section-label">
                        Lieu à découvrir
                      </span>

                      <h3>{place.title}</h3>

                      {place.subtitle && (
                        <strong>{place.subtitle}</strong>
                      )}

                      {place.excerpt && (
                        <p>{place.excerpt}</p>
                      )}

                      {place.address && (
                        <div className="public-content-address">
                          <MapPin size={16} />
                          {place.address}
                        </div>
                      )}

                      {place.latitude &&
                        place.longitude && (
                          <a
                            href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Voir sur la carte
                            <ArrowRight size={18} />
                          </a>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <Footer />
        <BackToTopButton />
      </main>
    </>
  );
}