import {
  useEffect,
  useState,
} from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logoSymbol from "../assets/dakhla-place-symbol.png";
import { getSocialNetworks } from "../services/api";

const SOCIAL_ICONS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  x: FaXTwitter,
};

export default function Footer() {
  const [socialNetworks, setSocialNetworks] =
    useState([]);

  useEffect(() => {
    async function loadSocialNetworks() {
      try {
        const data = await getSocialNetworks();

        setSocialNetworks(data.items ?? []);
      } catch {
        /*
         * Le footer reste utilisable même si les
         * réseaux ne peuvent pas être chargés.
         */
        setSocialNetworks([]);
      }
    }

    loadSocialNetworks();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img
              src={logoSymbol}
              alt=""
              aria-hidden="true"
            />

            <strong>
              <span>Dakhla</span>
              <em>Place</em>
            </strong>
          </Link>

          <p>
            Votre guide pour découvrir Dakhla, ses
            paysages, ses expériences et ses plus belles
            adresses.
          </p>

          {socialNetworks.length > 0 && (
            <div className="footer-socials">
              {socialNetworks.map((network) => {
                const Icon =
                  SOCIAL_ICONS[network.platform];

                if (!Icon) {
                  return null;
                }

                return (
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={network.name}
                    title={network.name}
                    key={network.id}
                  >
                    <Icon size={19} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="footer-column">
          <h3>Découvrir</h3>

          <Link to="/decouvrir-dakhla">
            Dakhla
          </Link>

          <Link to="/activites">
            Activités
          </Link>

          <Link to="/hebergements">
            Hébergements
          </Link>

          <Link to="/restaurants">
            Restaurants
          </Link>
        </div>

        <div className="footer-column">
          <h3>Préparer son séjour</h3>

          <Link to="/magazine/quand-partir-a-dakhla">
            Quand partir ?
          </Link>

          <Link to="/magazine/comment-venir-a-dakhla">
            Comment venir ?
          </Link>

          <Link to="/magazine/meteo-et-vent-a-dakhla">
            Météo et vent
          </Link>

          <Link to="/carte-dakhla">
            Carte de Dakhla
          </Link>
        </div>

        <div className="footer-column">
          <h3>Dakhla Place</h3>

          <Link to="/a-propos">
            À propos
          </Link>

          <Link to="/magazine">
            Le magazine
          </Link>

          <Link to="/espace-professionnels">
            Espace professionnels
          </Link>

          <Link to="/contact">
            Nous contacter
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Dakhla Place.
          Tous droits réservés.
        </p>

        <div>
          <Link to="/mentions-legales">
            Mentions légales
          </Link>

          <Link to="/confidentialite">
            Confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}