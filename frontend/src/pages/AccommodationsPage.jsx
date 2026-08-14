import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Hotel,
  House,
  Leaf,
  MapPin,
  Phone,
  Waves,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getPublicContents } from "../services/api";

import accommodationImage from "../assets/hebergement-dakhla.jpg";
import lagoonImage from "../assets/lagune-dakhla.jpg";

const accommodationTypes = [
  {
    id: "hotels",
    title: "Hôtels",
    description:
      "Des établissements en ville ou face à la lagune pour profiter pleinement de votre séjour.",
    icon: Hotel,
  },
  {
    id: "ecolodges",
    title: "Écolodges",
    description:
      "Des hébergements intégrés dans les paysages naturels entre océan et désert.",
    icon: Leaf,
  },
  {
    id: "surf-camps",
    title: "Surf camps",
    description:
      "Des lieux pensés pour les amateurs de kitesurf, de surf et de sports nautiques.",
    icon: Waves,
  },
  {
    id: "guesthouses",
    title: "Maisons d’hôtes",
    description:
      "Des adresses conviviales pour découvrir Dakhla dans une atmosphère plus intime.",
    icon: House,
  },
];

function getMainImage(item) {
  return (
    item.images?.find((image) => image.isMain) ??
    item.images?.[0] ??
    null
  );
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccommodations() {
      try {
        const data = await getPublicContents({
          type: "accommodation",
        });

        setAccommodations(data.items ?? []);
      } catch (requestError) {
        setError(
          requestError.message ??
          "Impossible de charger les hébergements."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccommodations();
  }, []);

  const featuredAccommodation = useMemo(
    () =>
      accommodations.find(
        (item) => item.isFeatured
      ) ??
      accommodations[0] ??
      null,
    [accommodations]
  );

  const featuredImage = featuredAccommodation
    ? getMainImage(featuredAccommodation)
    : null;

  return (
    <main className="inner-page">
      <Header />

      <section
        className="inner-hero accommodation-hero"
        style={{
          backgroundImage: `url(${featuredImage?.url ??
            accommodationImage
            })`,
        }}
      >
        <div className="inner-hero-overlay" />

        <div className="inner-hero-content">
          <span>
            <Hotel size={17} />
            Préparez votre séjour
          </span>

          <h1>Où dormir à Dakhla&nbsp;?</h1>

          <p>
            Hôtels, écolodges, camps et maisons
            d’hôtes : choisissez l’hébergement qui
            correspond à votre manière de voyager.
          </p>
        </div>
      </section>

      <section className="accommodation-introduction">
        <div>
          <span className="section-label">
            Trouver son hébergement
          </span>

          <h2>
            Un séjour au plus près des paysages
          </h2>
        </div>

        <p>
          Que vous souhaitiez rester au cœur de la
          ville, dormir face à la lagune ou vous
          éloigner dans le désert, Dakhla propose
          plusieurs styles d’hébergement.
        </p>
      </section>

      <section className="accommodation-types">
        {accommodationTypes.map((type, index) => {
          const Icon = type.icon;

          return (
            <article
              className="accommodation-type-card"
              id={type.id}
              key={type.id}
            >
              <div className="accommodation-type-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="accommodation-type-icon">
                <Icon size={27} />
              </div>

              <h2>{type.title}</h2>
              <p>{type.description}</p>

              <a href="#accommodation-list">
                Voir les établissements
                <ArrowRight size={18} />
              </a>
            </article>
          );
        })}
      </section>

      <section
        className="public-content-section"
        id="accommodation-list"
      >
        <div className="public-content-heading">
          <span className="section-label">
            Nos adresses
          </span>

          <h2>Les hébergements à Dakhla</h2>

          <p>
            Découvrez les établissements publiés et
            actualisés depuis DakhlaPlace.
          </p>
        </div>

        {loading && (
          <div className="public-content-state">
            Chargement des hébergements…
          </div>
        )}

        {error && (
          <div className="public-content-state error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          accommodations.length === 0 && (
            <div className="public-content-state">
              Aucun hébergement publié pour le
              moment.
            </div>
          )}

        {!loading && accommodations.length > 0 && (
          <div className="public-content-grid">
            {accommodations.map((item) => {
              const image = getMainImage(item);

              return (
                <article
                  className="public-content-card"
                  key={item.id}
                >
                  <div className="public-content-image">
                    {image ? (
                      <img
                        src={image.url}
                        alt={
                          image.altText ??
                          item.title
                        }
                      />
                    ) : (
                      <div className="public-image-empty">
                        <Hotel size={32} />
                      </div>
                    )}

                    {item.isFeatured && (
                      <span className="featured-badge">
                        Recommandé
                      </span>
                    )}
                  </div>

                  <div className="public-content-card-body">
                    <span className="section-label">
                      Hébergement
                    </span>

                    <h3>{item.title}</h3>

                    {item.subtitle && (
                      <strong>
                        {item.subtitle}
                      </strong>
                    )}

                    {item.excerpt && (
                      <p>{item.excerpt}</p>
                    )}

                    {item.address && (
                      <div className="public-content-address">
                        <MapPin size={16} />
                        {item.address}
                      </div>
                    )}

                    {(item.phone || item.websiteUrl) && (
                      <div className="public-content-actions">
                        {item.phone && (
                          <a href={`tel:${item.phone}`}>
                            <Phone size={17} />
                            {item.phone}
                          </a>
                        )}

                        {item.websiteUrl && (
                          <a
                            href={item.websiteUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Visiter le site
                            <ExternalLink size={17} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="accommodation-highlight">
        <div className="accommodation-highlight-image">
          <img
            src={lagoonImage}
            alt="Lagune de Dakhla"
          />
        </div>

        <div className="accommodation-highlight-content">
          <span className="section-label">
            Bien choisir son séjour
          </span>

          <h2>Ville, lagune ou désert ?</h2>

          <p>
            Le centre-ville permet de rester proche
            des commerces et des restaurants. Les
            hébergements autour de la lagune
            privilégient la nature et les activités
            nautiques.
          </p>

          <p>
            Les camps plus éloignés offrent une
            expérience plus calme, au cœur des grands
            espaces.
          </p>

          <a href="#accommodation-list">
            Voir les hébergements
            <ArrowRight size={19} />
          </a>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}