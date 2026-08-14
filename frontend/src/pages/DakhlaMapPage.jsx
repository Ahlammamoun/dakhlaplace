import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import {
  Compass,
  MapPin,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import BackToTopButton from
  "../components/BackToTopButton";
import Footer from "../components/Footer";
import Header from "../components/Header";

import {
  getPublicContents,
  getPublicImageUrl,
} from "../services/api";

const DAKHLA_CENTER = [23.6848, -15.9582];
const MOROCCO_LABEL_POSITION = [
   23.5,
  -15.5,
];

const MOROCCO_LABEL_ICON = L.divIcon({
  className: "morocco-map-label",
  html: "<span>Maroc</span><br><span>Morocco</span>",
  iconSize: [180, 50],
  iconAnchor: [90, 25],
});

const FILTERS = [
  {
    value: "all",
    label: "Tout",
  },
  {
    value: "place",
    label: "À découvrir",
  },
  {
    value: "activity",
    label: "Activités",
  },
  {
    value: "accommodation",
    label: "Hébergements",
  },
  {
    value: "restaurant",
    label: "Restaurants",
  },
];

const TYPE_LABELS = {
  place: "À découvrir",
  activity: "Activité",
  accommodation: "Hébergement",
  restaurant: "Restaurant",
};

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getMainImage(content) {
  const images = Array.isArray(content.images)
    ? content.images
    : [];

  return (
    images.find((image) => image.isMain) ??
    images[0] ??
    null
  );
}

function getImagePath(image) {
  return (
    image?.url ??
    image?.path ??
    image?.imageUrl ??
    image?.filename ??
    ""
  );
}

function getCoordinates(content) {
  const latitudeValue =
    content.latitude ?? content.lat;

  const longitudeValue =
    content.longitude ??
    content.lng ??
    content.lon;

  if (
    latitudeValue === null ||
    latitudeValue === undefined ||
    latitudeValue === "" ||
    longitudeValue === null ||
    longitudeValue === undefined ||
    longitudeValue === ""
  ) {
    return null;
  }

  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function MapSizeUpdater() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    function refreshMap() {
      window.requestAnimationFrame(() => {
        map.invalidateSize({
          animate: false,
          pan: false,
        });
      });
    }

    refreshMap();

    const resizeObserver = new ResizeObserver(
      refreshMap
    );

    resizeObserver.observe(container);

    window.addEventListener("resize", refreshMap);

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        refreshMap
      );
    };
  }, [map]);

  return null;
}

export default function DakhlaMapPage() {
  const [contents, setContents] = useState([]);
  const [activeFilter, setActiveFilter] =
    useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let componentMounted = true;

    async function loadContents() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getPublicContents();

        const publicContents = Array.isArray(
          response?.items
        )
          ? response.items
          : [];

        if (componentMounted) {
          setContents(publicContents);
        }
      } catch (requestError) {
        if (componentMounted) {
          setError(
            requestError.message ??
            "Impossible de charger les lieux."
          );
        }
      } finally {
        if (componentMounted) {
          setLoading(false);
        }
      }
    }

    loadContents();

    return () => {
      componentMounted = false;
    };
  }, []);

  const mapContents = useMemo(() => {
    return contents.filter((content) => {
      const coordinates =
        getCoordinates(content);

      const matchesFilter =
        activeFilter === "all" ||
        content.type === activeFilter;

      return Boolean(
        coordinates && matchesFilter
      );
    });
  }, [contents, activeFilter]);

  return (
    <main className="dakhla-interactive-map-page">
      <Header solid />

      <section className="interactive-map-heading">
        <span className="section-label">
          <Compass size={17} />
          Explorez la destination
        </span>

        <h1>La carte de Dakhla</h1>

        <p>
          Retrouvez les lieux incontournables, les
          activités, les hébergements et les restaurants
          autour de la lagune de Dakhla.
        </p>

        <div
          className="interactive-map-filters"
          aria-label="Filtrer les lieux"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={
                activeFilter === filter.value
                  ? "active"
                  : ""
              }
              onClick={() => {
                setActiveFilter(filter.value);
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="interactive-map-section">
        {loading && (
          <div className="interactive-map-state">
            Chargement de la carte…
          </div>
        )}

        {!loading && error && (
          <div className="interactive-map-state error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <MapContainer
              center={DAKHLA_CENTER}
              zoom={10}
              minZoom={8}
              scrollWheelZoom
              className="dakhla-leaflet-map"
            >
              <MapSizeUpdater />

              <TileLayer
                attribution={
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                }
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
              />

              <Marker position={DAKHLA_CENTER}>
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -18]}
                  className="dakhla-city-label"
                >
                  Dakhla
                </Tooltip>

                <Popup
                  autoPan
                  keepInView
                  autoPanPaddingTopLeft={[20, 110]}
                  autoPanPaddingBottomRight={[20, 20]}
                >
                  <strong>Ville de Dakhla</strong>
                </Popup>
              </Marker>

              <Marker
                position={MOROCCO_LABEL_POSITION}
                icon={MOROCCO_LABEL_ICON}
                interactive={false}
              />

              {mapContents.map((content) => {
                const coordinates =
                  getCoordinates(content);

                if (!coordinates) {
                  return null;
                }

                const mainImage =
                  getMainImage(content);

                const imagePath =
                  getImagePath(mainImage);

                const telephone =
                  content.phone?.replace(
                    /[^+\d]/g,
                    ""
                  );

                return (
                  <Marker
                    key={`${content.type}-${content.id}`}
                    position={[
                      coordinates.latitude,
                      coordinates.longitude,
                    ]}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -18]}
                      className="dakhla-place-label"
                    >
                      {content.title}
                    </Tooltip>

                    <Popup
                      maxWidth={310}
                      minWidth={270}
                      autoPan
                      keepInView
                      autoPanPaddingTopLeft={[20, 110]}
                      autoPanPaddingBottomRight={[20, 20]}
                    >
                      <article className="interactive-map-popup">
                        {imagePath && (
                          <img
                            src={getPublicImageUrl(
                              imagePath
                            )}
                            alt={
                              mainImage?.altText ??
                              content.title
                            }
                          />
                        )}

                        <div className="interactive-map-popup-body">
                          <span>
                            {TYPE_LABELS[
                              content.type
                            ] ?? content.type}
                          </span>

                          <h2>
                            {content.title}
                          </h2>

                          {content.excerpt && (
                            <p>
                              {content.excerpt}
                            </p>
                          )}

                          {content.address && (
                            <div className="interactive-map-address">
                              <MapPin size={15} />

                              <strong>
                                {content.address}
                              </strong>
                            </div>
                          )}

                          {content.phone && (
                            <a
                              href={`tel:${telephone}`}
                            >
                              {content.phone}
                            </a>
                          )}

                          {content.websiteUrl && (
                            <a
                              href={
                                content.websiteUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Visiter le site
                            </a>
                          )}
                        </div>
                      </article>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            <div className="interactive-map-results">
              <MapPin size={17} />

              <span>
                {mapContents.length}{" "}
                {mapContents.length > 1
                  ? "lieux affichés"
                  : "lieu affiché"}
              </span>
            </div>

            {mapContents.length === 0 && (
              <p className="interactive-map-empty">
                Aucun contenu de cette catégorie ne
                possède encore de coordonnées
                géographiques.
              </p>
            )}
          </>
        )}
      </section>

      <Footer />
      <BackToTopButton />
    </main>
  );
}