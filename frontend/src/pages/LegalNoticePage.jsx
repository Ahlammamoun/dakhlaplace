import { Scale } from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function LegalNoticePage() {
  return (
    <main>
      <Header solid />

      <section className="legal-page">
        <header className="legal-page-header">
          <span className="section-label">
            <Scale size={17} />
            Informations légales
          </span>

          <h1>Mentions légales</h1>

          <p>
            Informations relatives à l’édition et à
            l’hébergement du site Dakhla Place.
          </p>
        </header>

        <div className="legal-page-content">
          <section>
            <h2>Éditeur du site</h2>

            <p>
              Le site Dakhla Place est édité par :
            </p>

            <ul>
              <li>
                <strong>Wolfram & Hart</strong>
              </li>
              <li>
                200 rue de la Croix-Nivert,
                75015 Paris, France
              </li>
              <li>SIRET : 878 723 360 00029</li>
              <li>
                Adresse électronique :{" "}
                <a href="mailto:contact@wfhart.com">
                  contact@wfhart.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2>Hébergement</h2>

            <p>Le site est hébergé par :</p>

            <ul>
              <li>
                <strong>OVH SAS</strong>
              </li>
              <li>
                2 rue Kellermann, 59100 Roubaix,
                France
              </li>
              <li>
                Site :{" "}
                <a
                  href="https://www.ovhcloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.ovhcloud.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2>Propriété intellectuelle</h2>

            <p>
              La structure, les textes, les éléments
              graphiques, le logo et les contenus publiés
              sur Dakhla Place sont protégés par les
              règles relatives à la propriété
              intellectuelle.
            </p>

            <p>
              Toute reproduction, représentation,
              adaptation ou exploitation, totale ou
              partielle, sans autorisation préalable est
              interdite, sauf dans les cas prévus par la
              loi.
            </p>
          </section>

          <section>
            <h2>Photographies et contenus tiers</h2>

            <p>
              Les photographies et contenus appartenant à
              des tiers restent la propriété de leurs
              auteurs ou titulaires respectifs. Leur
              utilisation est soumise aux autorisations
              et licences correspondantes.
            </p>
          </section>

          <section>
            <h2>Responsabilité</h2>

            <p>
              Dakhla Place s’efforce de fournir des
              informations exactes et régulièrement mises
              à jour. Les horaires, tarifs, coordonnées et
              disponibilités des établissements peuvent
              toutefois évoluer.
            </p>

            <p>
              Les visiteurs sont invités à vérifier les
              informations directement auprès des
              professionnels concernés avant leur
              déplacement.
            </p>
          </section>

          <section>
            <h2>Liens externes</h2>

            <p>
              Le site peut contenir des liens vers des
              services externes. Wolfram & Hart ne peut
              être tenue responsable du contenu ou du
              fonctionnement de ces sites tiers.
            </p>
          </section>

          <section>
            <h2>Nous contacter</h2>

            <p>
              Pour toute question concernant le site,
              écrivez à{" "}
              <a href="mailto:contact@wfhart.com">
                contact@wfhart.com
              </a>.
            </p>
          </section>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}