import {
  ArrowRight,
  MapPin,
  UtensilsCrossed,
} from "lucide-react";

import accommodationImage from "../assets/hebergement-dakhla.jpg";
import foodImage from "../assets/gastronomie-dakhla.jpg";
import { Link } from "react-router-dom";

export default function Stay() {
  return (
    <section id="stay" className="stay-section">
      <div className="stay-heading">
        <span className="section-label">
          Organisez votre séjour
        </span>

        <h2>Profitez pleinement de Dakhla</h2>

        <p>
          Trouvez un hébergement au cœur des paysages de Dakhla
          et découvrez une gastronomie inspirée par l’océan et
          le désert.
        </p>
      </div>

      <div className="stay-grid">
        <article className="stay-card">
          <img
            src={accommodationImage}
            alt="Hébergement dans le désert"
          />

          <div className="stay-card-overlay" />

          <div className="stay-card-content">
            <div className="stay-card-top">
              <span>Hôtels, écolodges et camps</span>
              <MapPin size={20} />
            </div>

            <div>
              <h3>Où dormir</h3>

              <p>
                Des établissements sélectionnés pour séjourner
                entre lagune, océan et désert.
              </p>

              <Link to="/hebergements">
                Découvrir les hébergements
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </article>

        <article id="restaurants" className="stay-card">
          <img
            src={foodImage}
            alt="Produits de la mer et gastronomie marocaine"
          />

          <div className="stay-card-overlay" />

          <div className="stay-card-content">
            <div className="stay-card-top">
              <span>Restaurants et spécialités</span>
              <UtensilsCrossed size={20} />
            </div>

            <div>
              <h3>Où manger</h3>

              <p>
                Huîtres, poissons frais et cuisine marocaine :
                découvrez les meilleures tables de Dakhla.
              </p>

              <Link to="/restaurants">
                Découvrir les restaurants
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}