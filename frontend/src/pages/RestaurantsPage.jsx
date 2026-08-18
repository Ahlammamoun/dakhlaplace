import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Coffee,
  CookingPot,
  ExternalLink,
  Fish,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getPublicContents } from "../services/api";
import Seo from "../components/Seo";
import foodImage from "../assets/gastronomie-dakhla.jpg";
import lagoonImage from "../assets/lagune-dakhla.jpg";

const foodCategories = [
  {
    id: "seafood",
    title: "Poissons et fruits de mer",
    description:
      "Découvrez les produits de l’Atlantique, les poissons frais et les plateaux de fruits de mer.",
    icon: Fish,
  },
  {
    id: "moroccan-food",
    title: "Cuisine marocaine",
    description:
      "Tajines, couscous et recettes du Sud : retrouvez les saveurs de la cuisine traditionnelle.",
    icon: CookingPot,
  },
  {
    id: "oysters",
    title: "Huîtres de Dakhla",
    description:
      "Goûtez l’une des spécialités emblématiques de la région dans les fermes et restaurants locaux.",
    icon: UtensilsCrossed,
  },
  {
    id: "cafes",
    title: "Cafés et pauses gourmandes",
    description:
      "Profitez d’un thé, d’un café ou d’une pause sucrée dans une atmosphère détendue.",
    icon: Coffee,
  },
];

function getMainImage(item) {
  return (
    item.images?.find((image) => image.isMain) ??
    item.images?.[0] ??
    null
  );
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await getPublicContents({
          type: "restaurant",
        });

        setRestaurants(data.items ?? []);
      } catch (requestError) {
        setError(
          requestError.message ??
          "Impossible de charger les restaurants."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);

  const featuredRestaurant = useMemo(
    () =>
      restaurants.find(
        (restaurant) =>
          restaurant.isFeatured
      ) ??
      restaurants[0] ??
      null,
    [restaurants]
  );

  const featuredImage = featuredRestaurant
    ? getMainImage(featuredRestaurant)
    : null;

  return (

    <>
      <Seo
        title="Restaurants à Dakhla : où manger ?"
        description="Découvrez les meilleurs restaurants à Dakhla au Maroc : poissons, fruits de mer, huîtres locales, cuisine marocaine et bonnes adresses face à la lagune."
        path="/restaurants"
        image={featuredImage?.url ?? foodImage}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Restaurants à Dakhla",
          url: "https://dakhlaplace.com/restaurants",
          description:
            "Guide des restaurants et bonnes adresses à Dakhla : poissons, fruits de mer, cuisine marocaine, huîtres et spécialités locales.",
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
        <Header />

        <section
          className="inner-hero restaurants-hero"
          style={{
            backgroundImage: `url(${featuredImage?.url ?? foodImage
              })`,
          }}
        >
          <div className="inner-hero-overlay" />

          <div className="inner-hero-content">
            <span>
              <UtensilsCrossed size={17} />
              Gastronomie et bonnes adresses
            </span>

            <h1>Les saveurs de Dakhla</h1>

            <p>
              Produits de la mer, cuisine marocaine et
              spécialités locales : découvrez une
              destination aussi généreuse dans
              l’assiette que dans ses paysages.
            </p>
          </div>
        </section>

        <section className="restaurants-introduction">
          <span className="section-label">
            Où manger à Dakhla ?
          </span>

          <h2>Une cuisine inspirée par l’océan</h2>

          <p>
            La gastronomie de Dakhla met à l’honneur
            les produits frais de l’Atlantique et les
            traditions culinaires du Sud marocain.
          </p>
        </section>

        <section className="food-categories">
          {foodCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <article
                className="food-category-card"
                id={category.id}
                key={category.id}
              >
                <div className="food-category-heading">
                  <div className="food-category-icon">
                    <Icon size={26} />
                  </div>

                  <span>
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <h2>{category.title}</h2>
                <p>{category.description}</p>

                <a href="#restaurant-list">
                  Voir les adresses
                  <ArrowRight size={18} />
                </a>
              </article>
            );
          })}
        </section>

        <section
          className="public-content-section"
          id="restaurant-list"
        >
          <div className="public-content-heading">
            <span className="section-label">
              Bonnes adresses
            </span>

            <h2>Les restaurants à Dakhla</h2>

            <p>
              Découvrez les restaurants et producteurs
              publiés sur DakhlaPlace.
            </p>
          </div>

          {loading && (
            <div className="public-content-state">
              Chargement des restaurants…
            </div>
          )}

          {error && (
            <div className="public-content-state error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            restaurants.length === 0 && (
              <div className="public-content-state">
                Aucun restaurant publié pour le
                moment.
              </div>
            )}

          {!loading && restaurants.length > 0 && (
            <div className="public-content-grid">
              {restaurants.map((restaurant) => {
                const image =
                  getMainImage(restaurant);

                return (
                  <article
                    className="public-content-card"
                    key={restaurant.id}
                  >
                    <div className="public-content-image">
                      {image ? (
                        <img
                          src={image.url}
                          alt={
                            image.altText ??
                            restaurant.title
                          }
                        />
                      ) : (
                        <div className="public-image-empty">
                          <UtensilsCrossed
                            size={32}
                          />
                        </div>
                      )}

                      {restaurant.isFeatured && (
                        <span className="featured-badge">
                          Recommandé
                        </span>
                      )}
                    </div>

                    <div className="public-content-card-body">
                      <span className="section-label">
                        Restaurant
                      </span>

                      <h3>{restaurant.title}</h3>

                      {restaurant.subtitle && (
                        <strong>
                          {restaurant.subtitle}
                        </strong>
                      )}

                      {restaurant.excerpt && (
                        <p>{restaurant.excerpt}</p>
                      )}

                      {restaurant.address && (
                        <div className="public-content-address">
                          <MapPin size={16} />
                          {restaurant.address}
                        </div>
                      )}

                      {(restaurant.phone ||
                        restaurant.websiteUrl) && (
                          <div className="public-content-actions">
                            {restaurant.phone && (
                              <a
                                href={`tel:${restaurant.phone}`}
                              >
                                <Phone size={17} />
                                {restaurant.phone}
                              </a>
                            )}

                            {restaurant.websiteUrl && (
                              <a
                                href={
                                  restaurant.websiteUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                Visiter le site
                                <ExternalLink
                                  size={17}
                                />
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

        <section className="food-highlight">
          <div className="food-highlight-content">
            <span className="section-label">
              Une expérience locale
            </span>

            <h2>Déguster face à la lagune</h2>

            <p>
              Certaines des expériences les plus
              marquantes de Dakhla associent produits
              locaux, paysages naturels et moments de
              partage.
            </p>

            <p>
              Consultez les adresses publiées avec
              leurs coordonnées et leur localisation.
            </p>

            <a href="#restaurant-list">
              Voir les restaurants
              <ArrowRight size={19} />
            </a>
          </div>

          <div className="food-highlight-image">
            <img
              src={lagoonImage}
              alt="Lagune de Dakhla"
            />
          </div>
        </section>

        <Footer />
        <BackToTopButton />
      </main>
    </>
  );
}