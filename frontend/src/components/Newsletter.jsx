import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

import { subscribeNewsletter } from "../services/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await subscribeNewsletter(email);

      setMessage(
        data.message ??
          "Votre inscription a bien été enregistrée."
      );

      setEmail("");
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible de vous inscrire pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <div className="newsletter-icon">
          <Mail size={26} />
        </div>

        <span>La lettre de Dakhla</span>

        <h2>
          Recevez un peu de Dakhla dans votre boîte mail
        </h2>

        <p>
          Bons plans, nouvelles adresses et idées
          d’expériences pour préparer votre prochain
          séjour.
        </p>

        <form
          className="newsletter-form"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Votre adresse e-mail"
            aria-label="Votre adresse e-mail"
            autoComplete="email"
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Inscription…" : "S’inscrire"}
            <ArrowRight size={18} />
          </button>
        </form>

        {message && (
          <div
            className="newsletter-message success"
            role="status"
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div
            className="newsletter-message error"
            role="alert"
          >
            {error}
          </div>
        )}

        <small>
          En vous inscrivant, vous acceptez de recevoir
          les actualités de Dakhla Place.
        </small>
      </div>
    </section>
  );
}