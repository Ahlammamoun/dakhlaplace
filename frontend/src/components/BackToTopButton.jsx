import { useEffect, useState } from "react";
import surferImage from "../assets/surfer.png";

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setIsVisible(window.scrollY > 500);
        }

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <button
            type="button"
            className={`back-to-top ${isVisible ? "back-to-top-visible" : ""
                }`}
            aria-label="Revenir en haut de la page"
            onClick={scrollToTop}
        >
            <img
                src={surferImage}
                alt=""
                aria-hidden="true"
            />
        </button>
    );
}