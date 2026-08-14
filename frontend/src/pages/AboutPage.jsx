import {
  Compass,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

import lagoonImage from "../assets/lagune-dakhla.jpg";
import desertImage from "../assets/desert-dakhla.jpg";

export default function AboutPage() {
  return (
    <main>
      <Header />

      <section
        className="inner-hero"
        style={{
          backgroundImage: `url(${lagoonImage})`,
        }}
      >
        <div className="inner-hero-overlay" />

        <div className="inner-hero-content">
          <span>
            <Compass size={17} />
            À propos de Dakhla Place
          </span>

          <h1>Découvrir Dakhla autrement</h1>

          <p>
            Un guide indépendant consacré aux paysages,
            aux expériences et aux plus belles adresses
            de Dakhla.
          </p>
        </div>
      </section>

      <section className="discover-intro">
        <div>
          <span className="section-label">
            Notre mission
          </span>

          <h2>
            Vous aider à vivre une expérience authentique
            à Dakhla
          </h2>
        </div>

        <div className="discover-intro-text">
          <p>
            Dakhla Place est né de l’envie de faire
            découvrir une destination unique, située
            entre l’océan Atlantique, la lagune et les
            grands espaces du désert.
          </p>

          <p>
            Nous rassemblons des lieux à visiter, des
            activités, des hébergements, des restaurants
            et des conseils pratiques pour faciliter la
            préparation de chaque séjour.
          </p>
        </div>
      </section>

      <section className="about-story-section">
        <div className="about-story-image">
          <img
            src={desertImage}
            alt="Paysage désertique autour de Dakhla"
          />
        </div>

        <div className="about-story-content">
          <span className="section-label">
            Notre vision
          </span>

          <h2>
            Mettre en valeur celles et ceux qui font
            vivre Dakhla
          </h2>

          <p>
            Dakhla Place souhaite donner de la visibilité
            aux acteurs locaux et proposer aux visiteurs
            des informations utiles, accessibles et
            régulièrement mises à jour.
          </p>

          <p>
            Chaque adresse et chaque expérience présentée
            contribue à raconter le territoire, son
            identité et son lien exceptionnel avec la
            nature.
          </p>
        </div>
      </section>

      <section className="about-values-section">
        <div className="public-content-heading">
          <span className="section-label">
            Nos engagements
          </span>

          <h2>Un guide utile et inspirant</h2>
        </div>

        <div className="about-values-grid">
          <article>
            <span>
              <MapPin size={24} />
            </span>

            <h3>Adresses locales</h3>

            <p>
              Mettre en avant les lieux et les
              professionnels qui participent à la vie de
              la région.
            </p>
          </article>

          <article>
            <span>
              <Sparkles size={24} />
            </span>

            <h3>Expériences sélectionnées</h3>

            <p>
              Proposer des idées adaptées à différents
              styles de voyage et à toutes les saisons.
            </p>
          </article>

          <article>
            <span>
              <Heart size={24} />
            </span>

            <h3>Respect du territoire</h3>

            <p>
              Encourager une découverte attentive aux
              paysages, aux habitants et à
              l’environnement.
            </p>
          </article>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}