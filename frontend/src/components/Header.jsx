import {
  useEffect,
  useState,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import logoSymbol from "../assets/dakhla-place-symbol.png";

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
      className={`header ${
        isScrolled || solid ? "header-scrolled" : ""
      }`}
    >
      <Link to="/" className="logo" onClick={closeMenu}>
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
        className={`navigation ${
          menuOpen ? "navigation-open" : ""
        }`}
      >
        <Link
          to="/decouvrir-dakhla"
          onClick={closeMenu}
        >
          Découvrir
        </Link>

        <Link
          to="/activites"
          onClick={closeMenu}
        >
          Activités
        </Link>

        <Link
          to="/hebergements"
          onClick={closeMenu}
        >
          Séjourner
        </Link>

        <Link
          to="/restaurants"
          onClick={closeMenu}
        >
          Restaurants
        </Link>

        <Link
          to="/magazine"
          onClick={closeMenu}
        >
          Le magazine
        </Link>

        <Link
          to="/carte-dakhla"
          className="mobile-explore-link"
          onClick={closeMenu}
        >
          Explorer Dakhla
        </Link>
      </nav>

      <Link
        to="/carte-dakhla"
        className="header-button"
      >
        Explorer Dakhla
      </Link>

      <button
        type="button"
        className="menu-button"
        aria-label={
          menuOpen
            ? "Fermer le menu"
            : "Ouvrir le menu"
        }
        aria-expanded={menuOpen}
        onClick={() =>
          setMenuOpen((isOpen) => !isOpen)
        }
      >
        {menuOpen ? (
          <X size={27} />
        ) : (
          <Menu size={27} />
        )}
      </button>
    </header>
  );
}