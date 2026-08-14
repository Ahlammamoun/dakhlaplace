import {
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import DiscoverPage from "./pages/DiscoverPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import AccommodationsPage from "./pages/AccommodationsPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import MagazinePage from "./pages/MagazinePage";
import ArticlePage from "./pages/ArticlePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminContentFormPage from "./pages/admin/AdminContentFormPage";
import ScrollToTop from "./components/ScrollToTop";
import AdminNewsletterPage from "./pages/admin/AdminNewsletterPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import LegalNoticePage from "./pages/LegalNoticePage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import DakhlaMapPage from "./pages/DakhlaMapPage";
import AdminSocialNetworksPage from "./pages/admin/AdminSocialNetworksPage";
import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/decouvrir-dakhla"
          element={<DiscoverPage />}
        />
        <Route path="/activites" element={<ActivitiesPage />} />
        <Route
          path="/hebergements"
          element={<AccommodationsPage />}
        />
        <Route
          path="/restaurants"
          element={<RestaurantsPage />}
        />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route
          path="/magazine/:slug"
          element={<ArticlePage />}
        />

        <Route
          path="/a-propos"
          element={<AboutPage />}
        />
        <Route
          path="/contact"
          element={<ContactPage />}
        />
        <Route
          path="/espace-professionnels"
          element={<ProfessionalsPage />}
        />
        <Route
          path="/mentions-legales"
          element={<LegalNoticePage />}
        />

        <Route
          path="/confidentialite"
          element={<PrivacyPage />}
        />
        <Route
          path="/carte-dakhla"
          element={<DakhlaMapPage />}
        />
        <Route
          path="/admin/social-networks"
          element={<AdminSocialNetworksPage />}
        />
        <Route
          path="/admin/messages"
          element={<AdminMessagesPage />}
        />
        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />
        <Route
          path="/admin"
          element={<AdminDashboardPage />}
        />
        <Route
          path="/admin/content/new"
          element={<AdminContentFormPage />}
        />

        <Route
          path="/admin/content/:id/edit"
          element={<AdminContentFormPage />}
        />

        <Route
          path="/admin/newsletter"
          element={<AdminNewsletterPage />}
        />
      </Routes>
    </>
  );
}

export default App;