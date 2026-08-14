import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { getPublicContents } from "../services/api";

function getMainImage(item) {
  return (
    item.images?.find((image) => image.isMain) ??
    item.images?.[0] ??
    null
  );
}

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlaces() {
      try {
        let data = await getPublicContents({
          type: "place",
          featured: true,
        });

        let items = data.items ?? [];

        /*
         * Si aucun lieu n’est marqué comme étant mis
         * en avant, on affiche les premiers lieux publiés.
         */
        if (items.length === 0) {
          data = await getPublicContents({
            type: "place",
          });

          items = data.items ?? [];
        }

        setPlaces(items.slice(0, 3));
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

  return (
    <section
      className="places-section"
      id="discover"
    >
      <div className="section-heading">
        <div>
          <span className="section-label">
            Les incontournables
          </span>

          <h2>Explorez les merveilles de Dakhla</h2>
        </div>

        <p>
          Des eaux turquoise aux étendues sauvages du
          désert, découvrez les lieux qui rendent
          Dakhla inoubliable.
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
        <div className="places-grid">
          {places.map((place, index) => {
            const image = getMainImage(place);

            return (
              <article
                className={`place-card ${index === 0
                  ? "place-card-large"
                  : ""
                  }`}
                key={place.id}
              >
                {image && (
                  <img
                    src={image.url}
                    alt={
                      image.altText ??
                      place.title
                    }
                  />
                )}

                <div className="place-card-overlay" />

                <div className="place-card-content">
                  <span>
                    {place.isFeatured
                      ? "Lieu incontournable"
                      : "Découvrir Dakhla"}
                  </span>

                  <h3>{place.title}</h3>

                  {(place.excerpt ||
                    place.subtitle) && (
                      <p>
                        {place.excerpt ??
                          place.subtitle}
                      </p>
                    )}

                  <Link
                    to={`/decouvrir-dakhla#${place.slug}`}
                  >
                    Découvrir
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