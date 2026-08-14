import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
  Waves,
  X,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import heroImage from "../assets/hero-dakhla.jpg";
import { getPublicContents } from "../services/api";
import Header from "./Header";

const TYPE_LABELS = {
  place: "Lieu",
  activity: "Activité",
  accommodation: "Hébergement",
  restaurant: "Restaurant",
  article: "Article",
};

function getContentLink(item) {
  switch (item.type) {
    case "activity":
      return `/activites#${item.slug}`;

    case "accommodation":
      return `/hebergements#${item.slug}`;

    case "restaurant":
      return `/restaurants#${item.slug}`;

    case "article":
      return `/magazine/${item.slug}`;

    case "place":
    default:
      return `/decouvrir-dakhla#${item.slug}`;
  }
}

export default function Hero() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [searchOpened, setSearchOpened] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contents, setContents] = useState([]);
  const [searchLoading, setSearchLoading] =
    useState(false);
  const [searchError, setSearchError] =
    useState("");

  useEffect(() => {
    if (searchOpened) {
      searchInputRef.current?.focus();
    }
  }, [searchOpened]);

  async function openSearch() {
    setSearchOpened(true);

    if (contents.length > 0 || searchLoading) {
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const data = await getPublicContents();

      setContents(data.items ?? []);
    } catch (requestError) {
      setSearchError(
        requestError.message ??
          "Impossible de charger les résultats."
      );
    } finally {
      setSearchLoading(false);
    }
  }

  function closeSearch() {
    setSearchOpened(false);
    setSearchTerm("");
    setSearchError("");
  }

  const results = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLocaleLowerCase("fr");

    if (normalizedSearch.length < 2) {
      return [];
    }

    return contents
      .filter((item) => {
        const searchableText = [
          item.title,
          item.subtitle,
          item.excerpt,
          TYPE_LABELS[item.type],
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("fr");

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 8);
  }, [contents, searchTerm]);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      <div className="hero-overlay" />

      <Header />

      <div className="hero-content">
        <motion.div
          className="hero-label"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <MapPin size={17} />
          La perle du sud marocain
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
        >
          Entre océan
          <br />
          <span>et désert</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
          }}
        >
          Explorez Dakhla, une destination unique où
          les eaux turquoise rencontrent les dunes
          dorées.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.45,
          }}
        >
          <a
            href="#discover"
            className="primary-button"
          >
            Découvrir Dakhla
            <ArrowRight size={19} />
          </a>

          <a
            href="#activities"
            className="secondary-button"
          >
            Voir les expériences
          </a>
        </motion.div>
      </div>

      <div className="discovery-box">
        <div className="discovery-heading">
          <Compass size={22} />

          <div>
            <span>Préparez votre expérience</span>
            <strong>
              Que souhaitez-vous découvrir ?
            </strong>
          </div>
        </div>

        <div className="discovery-options">
          <button
            type="button"
            onClick={() => navigate("/activites")}
          >
            <Waves size={21} />
            Activités
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/decouvrir-dakhla")
            }
          >
            <MapPin size={21} />
            Lieux à visiter
          </button>

          <button
            type="button"
            className={
              searchOpened ? "active" : undefined
            }
            onClick={
              searchOpened ? closeSearch : openSearch
            }
          >
            {searchOpened ? (
              <X size={21} />
            ) : (
              <Search size={21} />
            )}

            {searchOpened ? "Fermer" : "Rechercher"}
          </button>
        </div>

        {searchOpened && (
          <div className="discovery-search-panel">
            <div className="discovery-search-field">
              <Search size={20} />

              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Rechercher un lieu, une activité, un restaurant…"
                aria-label="Rechercher sur Dakhla Place"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Effacer la recherche"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="discovery-search-results">
              {searchLoading && (
                <p>Chargement des contenus…</p>
              )}

              {searchError && (
                <p className="error">{searchError}</p>
              )}

              {!searchLoading &&
                !searchError &&
                searchTerm.trim().length < 2 && (
                  <p>
                    Saisissez au moins deux caractères.
                  </p>
                )}

              {!searchLoading &&
                searchTerm.trim().length >= 2 &&
                results.length === 0 && (
                  <p>Aucun résultat trouvé.</p>
                )}

              {results.map((item) => (
                <Link
                  to={getContentLink(item)}
                  key={item.id}
                  onClick={closeSearch}
                >
                  <span>
                    {TYPE_LABELS[item.type] ??
                      "Découverte"}
                  </span>

                  <strong>{item.title}</strong>

                  <ArrowRight size={17} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}