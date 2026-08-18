import { useEffect } from "react";

const SITE_NAME = "DakhlaPlace";
const SITE_URL = "https://dakhlaplace.com";

export default function Seo({
  title,
  description,
  path = "/",
  image = "/favicon.svg",
  type = "website",
  noIndex = false,
  structuredData = null,
}) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;

    const absoluteImage = image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`;

    document.documentElement.lang = "fr";
    document.title = fullTitle;

    const setMeta = (attribute, key, content) => {
      let element = document.head.querySelector(
        `meta[${attribute}="${key}"]`
      );

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }

      element.setAttribute("href", href);
    };

    setMeta("name", "description", description);

    setMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow"
    );

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", absoluteImage);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "fr_FR");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absoluteImage);

    setLink("canonical", canonicalUrl);

    const existingStructuredData = document.head.querySelector(
      'script[data-seo-structured-data="true"]'
    );

    if (existingStructuredData) {
      existingStructuredData.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoStructuredData = "true";
      script.textContent = JSON.stringify(structuredData);

      document.head.appendChild(script);
    }

    return () => {
      const script = document.head.querySelector(
        'script[data-seo-structured-data="true"]'
      );

      if (script) {
        script.remove();
      }
    };
  }, [
    title,
    description,
    path,
    image,
    type,
    noIndex,
    structuredData,
  ]);

  return null;
}