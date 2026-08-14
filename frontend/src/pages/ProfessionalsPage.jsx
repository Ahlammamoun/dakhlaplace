import {
  ArrowRight,
  Building2,
  Camera,
  MapPin,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

import accommodationImage from "../assets/hebergement-dakhla.jpg";
import lagoonImage from "../assets/lagune-dakhla.jpg";

export default function ProfessionalsPage() {
  return (
    <main>
      <Header />

      <section
        className="inner-hero"
        style={{
          backgroundImage: `url(${accommodationImage})`,
        }}
      >
        <div className="inner-hero-overlay" />

        <div className="inner-hero-content">
          <span>
            <Building2 size={17} />
            Espace professionnels
          </span>

          <h1>Faites connaître votre activité à Dakhla</h1>

          <p>
            Rejoignez Dakhla Place et présentez votre
            établissement ou votre expérience aux
            visiteurs.
          </p>
        </div>
      </section>

      <section className="discover-intro">
        <div>
          <span className="section-label">
            Professionnels de Dakhla
          </span>

          <h2>
            Développez votre visibilité auprès des
            voyageurs
          </h2>
        </div>

        <div className="discover-intro-text">
          <p>
            Vous gérez un hébergement, un restaurant, une
            activité ou un lieu touristique à Dakhla ?
            Dakhla Place vous permet de présenter votre
            établissement aux visiteurs.
          </p>

          <p>
            Contactez-nous pour proposer une nouvelle
            adresse, corriger une information ou mettre
            en valeur votre activité.
          </p>
        </div>
      </section>

      <section className="professionals-services">
        <div className="public-content-heading">
          <span className="section-label">
            Votre présence sur Dakhla Place
          </span>

          <h2>Présentez votre établissement</h2>
        </div>

        <div className="about-values-grid">
          <article>
            <span>
              <Store size={24} />
            </span>

            <h3>Une fiche détaillée</h3>

            <p>
              Présentez votre activité, votre adresse, vos
              coordonnées et votre site internet.
            </p>
          </article>

          <article>
            <span>
              <Camera size={24} />
            </span>

            <h3>Vos plus belles images</h3>

            <p>
              Mettez en valeur votre établissement et
              l’expérience proposée aux voyageurs.
            </p>
          </article>

          <article>
            <span>
              <MapPin size={24} />
            </span>

            <h3>Une présence sur la carte</h3>

            <p>
              Aidez les visiteurs à vous localiser grâce
              à vos coordonnées géographiques.
            </p>
          </article>
        </div>
      </section>

      <section className="professionals-contact">
        <div>
          <span className="section-label">
            Travaillons ensemble
          </span>

          <h2>Vous souhaitez apparaître sur le site ?</h2>

          <p>
            Présentez-nous votre établissement et votre
            activité. Nous étudierons votre demande avant
            sa publication.
          </p>

          <Link to="/contact">
            Nous contacter
            <ArrowRight size={19} />
          </Link>
        </div>

        <img
          src={lagoonImage}
          alt="Lagune de Dakhla"
        />
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}