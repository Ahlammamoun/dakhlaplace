import BackToTopButton from "../components/BackToTopButton";
import Experiences from "../components/Experiences";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import Magazine from "../components/Magazine";
import Newsletter from "../components/Newsletter";
import Places from "../components/Places";
import Stay from "../components/Stay";
import Seo from "../components/Seo";

export default function HomePage() {
  return (
     <>
    <Seo
      title="DakhlaPlace | Découvrir Dakhla, hôtels, restaurants et activités"
      description="Découvrez Dakhla au Maroc avec DakhlaPlace : lieux incontournables, hôtels, restaurants, activités, kitesurf, plages et conseils pour organiser votre séjour."
      path="/"
      structuredData={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DakhlaPlace",
        url: "https://dakhlaplace.com/",
        description:
          "Guide pour découvrir Dakhla au Maroc : lieux, hébergements, restaurants, activités et conseils de voyage.",
        inLanguage: "fr-FR",
      }}
    />
    <main>
      <Hero />
      <Introduction />
      <Places />
      <Experiences />
      <Stay />
      <Magazine />
      <Newsletter />
      <Footer />
      <BackToTopButton />
    </main>
     </>
  );
}