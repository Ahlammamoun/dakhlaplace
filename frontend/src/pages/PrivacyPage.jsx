import { ShieldCheck } from "lucide-react";

import BackToTopButton from "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PrivacyPage() {
  return (
    <main>
      <Header solid />

      <section className="legal-page">
        <header className="legal-page-header">
          <span className="section-label">
            <ShieldCheck size={17} />
            Données personnelles
          </span>

          <h1>Politique de confidentialité</h1>

          <p>
            Découvrez quelles données sont collectées par
            Dakhla Place et comment elles sont utilisées.
          </p>
        </header>

        <div className="legal-page-content">
          <section>
            <h2>Responsable du traitement</h2>

            <p>
              Le responsable du traitement des données
              collectées sur Dakhla Place est Wolfram &
              Hart, 200 rue de la Croix-Nivert,
              75015 Paris.
            </p>

            <p>
              Contact :{" "}
              <a href="mailto:contact@wfhart.com">
                contact@wfhart.com
              </a>
            </p>
          </section>

          <section>
            <h2>Données collectées</h2>

            <p>
              Dakhla Place peut collecter les données
              suivantes :
            </p>

            <ul>
              <li>
                votre adresse e-mail lors de
                l’inscription à la newsletter ;
              </li>
              <li>
                votre prénom, votre nom, votre adresse
                e-mail, l’objet et le contenu de votre
                message lorsque vous utilisez le
                formulaire de contact ;
              </li>
              <li>
                des données techniques nécessaires au
                fonctionnement et à la sécurité du site,
                notamment les journaux du serveur.
              </li>
            </ul>
          </section>

          <section>
            <h2>Finalités et bases légales</h2>

            <ul>
              <li>
                La newsletter est envoyée avec votre
                consentement.
              </li>
              <li>
                Les messages sont traités afin de répondre
                à votre demande.
              </li>
              <li>
                Les données techniques sont utilisées
                pour assurer la sécurité et le bon
                fonctionnement du site.
              </li>
            </ul>
          </section>

          <section>
            <h2>Durée de conservation</h2>

            <ul>
              <li>
                Les données de newsletter sont conservées
                jusqu’à votre désinscription.
              </li>
              <li>
                Les messages de contact sont conservés
                pendant une durée maximale de trois ans à
                compter du dernier échange.
              </li>
              <li>
                Les journaux techniques sont conservés
                pendant la durée nécessaire à la sécurité
                et au fonctionnement du service.
              </li>
            </ul>
          </section>

          <section>
            <h2>Destinataires</h2>

            <p>
              Les données sont accessibles uniquement aux
              personnes habilitées par Wolfram & Hart et
              aux prestataires techniques nécessaires au
              fonctionnement du site, notamment
              l’hébergeur.
            </p>

            <p>
              Les données ne sont ni vendues ni louées à
              des tiers.
            </p>
          </section>

          <section>
            <h2>Vos droits</h2>

            <p>
              Vous pouvez demander l’accès, la
              rectification, l’effacement ou la limitation
              du traitement de vos données. Vous pouvez
              également retirer votre consentement à la
              newsletter à tout moment.
            </p>

            <p>
              Pour exercer vos droits, écrivez à{" "}
              <a href="mailto:contact@wfhart.com">
                contact@wfhart.com
              </a>.
            </p>

            <p>
              Vous pouvez également adresser une
              réclamation à la CNIL.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>

            <p>
              Dakhla Place utilise uniquement les
              éléments techniques nécessaires à
              l’authentification et au fonctionnement du
              site. Si un outil de mesure d’audience ou
              des cookies non essentiels sont ajoutés,
              cette politique sera mise à jour et un
              dispositif de consentement sera proposé
              lorsque cela est requis.
            </p>
          </section>

          <section>
            <h2>Mise à jour</h2>

            <p>
              Dernière mise à jour : 12 août 2026.
            </p>
          </section>
        </div>
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}