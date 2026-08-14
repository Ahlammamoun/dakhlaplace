import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  ExternalLink,
  MapPin,
  Phone,
  Wind,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getPublicContents } from "../services/api";

import heroImage from "../assets/hero-dakhla.jpg";

function getMainImage(item) {
  return (
    item.images?.find((image) => image.isMain) ??
    item.images?.[0] ??
    null
  );
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getPublicContents({
          type: "activity",
        });

        setActivities(data.items ?? []);
      } catch (requestError) {
        setError(
          requestError.message ??
            "Impossible de charger les activités."
        );
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  const featuredActivity = useMemo(
    () =>
      activities.find(
        (activity) => activity.isFeatured
      ) ??
      activities[0] ??
      null,
    [activities]
  );

  const featuredImage = featuredActivity
    ? getMainImage(featuredActivity)
    : null;

  return (
    <main className="inner-page">
      <Header />

      <section
        className="inner-hero activities-hero"
        style={{
          backgroundImage: `url(${
            featuredImage?.url ?? heroImage
          })`,
        }}
      >
        <div className="inner-hero-overlay" />

        <div className="inner-hero-content">
          <span>
            <Wind size={17} />
            Expériences et aventures
          </span>

          <h1>Vivez Dakhla pleinement</h1>

          <p>
            Sur l’eau, dans le désert ou autour d’une
            table, découvrez toutes les expériences
            qui font de Dakhla une destination
            unique.
          </p>
        </div>
      </section>

      <section className="activities-introduction">
        <span className="section-label">
          Que faire à Dakhla ?
        </span>

        <h2>
          Choisissez votre prochaine expérience
        </h2>

        <p>
          Que vous recherchiez l’aventure, la nature,
          le sport ou la détente, Dakhla propose des
          activités pour tous les styles de voyage.
        </p>
      </section>

      <section
        className="activities-list"
        id="activities-list"
      >
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
          activities.length === 0 && (
            <div className="public-content-state">
              Aucune activité publiée pour le moment.
            </div>
          )}

        {!loading &&
          activities.map((activity, index) => {
            const image = getMainImage(activity);

            return (
              <article
                className={`activity-detail-card ${
                  index % 2 !== 0
                    ? "activity-detail-card-reverse"
                    : ""
                }`}
                id={activity.slug}
                key={activity.id}
              >
                <div className="activity-detail-image">
                  <img
                    src={image?.url ?? heroImage}
                    alt={
                      image?.altText ??
                      activity.title
                    }
                  />

                  <div className="activity-detail-icon">
                    <Compass size={25} />
                  </div>

                  {activity.isFeatured && (
                    <span className="featured-badge">
                      Incontournable
                    </span>
                  )}
                </div>

                <div className="activity-detail-content">
                  <span>Activité à Dakhla</span>

                  <h2>{activity.title}</h2>

                  {activity.subtitle && (
                    <strong>
                      {activity.subtitle}
                    </strong>
                  )}

                  {activity.excerpt && (
                    <p>{activity.excerpt}</p>
                  )}

                  {activity.content && (
                    <p>{activity.content}</p>
                  )}

                  <div className="activity-information">
                    {activity.address && (
                      <div>
                        <strong>Adresse</strong>
                        <span>
                          <MapPin size={15} />
                          {activity.address}
                        </span>
                      </div>
                    )}

                    {activity.phone && (
                      <div>
                        <strong>Téléphone</strong>
                        <a className="activity-phone"
                          href={`tel:${activity.phone}`}
                        >
                          <Phone size={15} />
                          {activity.phone}
                        </a>
                      </div>
                    )}

                    {activity.latitude &&
                      activity.longitude && (
                        <div>
                          <strong>Localisation</strong>
                          <a
                            href={`https://www.google.com/maps?q=${activity.latitude},${activity.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MapPin size={15} />
                            Voir la carte
                          </a>
                        </div>
                      )}
                  </div>

                  {activity.websiteUrl && (
                    <a
                      href={activity.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visiter le site
                      <ExternalLink size={17} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}