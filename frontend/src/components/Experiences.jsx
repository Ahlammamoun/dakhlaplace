import { useEffect, useState } from "react";
import {
  ArrowRight,
  Compass,
  Fish,
  UtensilsCrossed,
  Wind,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPublicContents } from "../services/api";

const ACTIVITY_ICONS = [
  Wind,
  Compass,
  Fish,
  UtensilsCrossed,
];

export default function Experiences() {
  const [experiences, setExperiences] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExperiences() {
      try {
        let data = await getPublicContents({
          type: "activity",
          featured: true,
        });

        let items = data.items ?? [];

        /*
         * Si aucune activité n’est mise en avant,
         * on utilise les premières activités publiées.
         */
        if (items.length === 0) {
          data = await getPublicContents({
            type: "activity",
          });

          items = data.items ?? [];
        }

        setExperiences(items.slice(0, 4));
      } catch (requestError) {
        setError(
          requestError.message ??
          "Impossible de charger les activités."
        );
      } finally {
        setLoading(false);
      }
    }

    loadExperiences();
  }, []);

  return (
    <section
      className="experiences-section"
      id="activities"
    >
      <div className="experiences-intro">
        <span className="section-label">
          Vivez Dakhla
        </span>

        <h2>
          Des expériences entre terre et océan
        </h2>

        <p>
          Ressentez le vent, explorez les grands
          espaces et découvrez les saveurs d’une
          destination profondément authentique.
        </p>

        <Link
          to="/activites"
          className="experiences-link"
        >
          Voir toutes les activités
          <ArrowRight size={19} />
        </Link>
      </div>

      {loading && (
        <div className="public-content-state">
          Chargement des activités…
        </div>
      )}

      {error && (
        <div className="public-content-state error">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        experiences.length === 0 && (
          <div className="public-content-state">
            Aucune activité publiée pour le moment.
          </div>
        )}

      {!loading && experiences.length > 0 && (
        <div className="experiences-grid">
          {experiences.map(
            (experience, index) => {
              const Icon =
                ACTIVITY_ICONS[
                index % ACTIVITY_ICONS.length
                ];

              return (
                <article
                  className="experience-card"
                  key={experience.id}
                >
                  <div className="experience-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="experience-icon">
                    <Icon size={27} />
                  </div>

                  <h3>{experience.title}</h3>

                  {(experience.excerpt ||
                    experience.subtitle) && (
                      <p>
                        {experience.excerpt ??
                          experience.subtitle}
                      </p>
                    )}

                  <Link
                    to={`/activites#${experience.slug}`}
                    aria-label={`Découvrir ${experience.title}`}
                  >
                    <ArrowRight size={19} />
                  </Link>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}