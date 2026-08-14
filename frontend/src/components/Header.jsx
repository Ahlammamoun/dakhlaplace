import {
  useEffect,
  useState,
} from "react";
import {
  Menu,
  X,
} from "lucide-react";

import logoSymbol from "../assets/dakhla-place-symbol.png";
import { Link } from "react-router-dom";

export default function Header({ solid = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 60);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      className={`header ${isScrolled || solid ? "header-scrolled" : ""
        }`}
    >
      <Link to="/" className="logo">
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

      <nav
        className={`navigation ${menuOpen ? "navigation-open" : ""
          }`}
      >
        <a href="/decouvrir-dakhla" onClick={closeMenu}>
          Découvrir
        </a>

        <a href="/activites" onClick={closeMenu}>
          Activités
        </a>

        <a href="/hebergements" onClick={closeMenu}>
          Séjourner
        </a>

        <a href="/restaurants" onClick={closeMenu}>
          Restaurants
        </a>

        <a href="/magazine" onClick={closeMenu}>
          Le magazine
        </a>
      </nav>

      <a href="/carte-dakhla" className="header-button">
        Explorer Dakhla
      </a>

      <button
        type="button"
        className="menu-button"
        aria-label={
          menuOpen ? "Fermer le menu" : "Ouvrir le menu"
        }
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        {menuOpen ? <X size={27} /> : <Menu size={27} />}
      </button>
    </header>
  );
}