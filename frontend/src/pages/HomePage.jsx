import BackToTopButton from "../components/BackToTopButton";
import Experiences from "../components/Experiences";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import Magazine from "../components/Magazine";
import Newsletter from "../components/Newsletter";
import Places from "../components/Places";
import Stay from "../components/Stay";

export default function HomePage() {
  return (
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
  );
}