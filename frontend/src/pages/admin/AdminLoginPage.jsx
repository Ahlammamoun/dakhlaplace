import { useEffect, useState } from "react";
import { LogIn, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  loginAdmin,
} from "../../services/api";

import "./AdminLoginPage.css";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const data = await getCurrentUser();

        if (data?.user?.roles?.includes("ROLE_ADMIN")) {
          navigate("/admin", {
            replace: true,
          });
        }
      } catch {
        // L’utilisateur n’est pas encore connecté.
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginAdmin(email.trim(), password);

      const data = await getCurrentUser();

      if (!data?.user?.roles?.includes("ROLE_ADMIN")) {
        throw new Error(
          "Ce compte ne possède pas les droits administrateur."
        );
      }

      navigate("/admin", {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError?.message ??
          "Impossible de vous connecter."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-loading">
          Vérification de la session…
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-icon">
            <MapPin size={26} />
          </span>

          <div>
            <strong>DakhlaPlace</strong>
            <span>Administration</span>
          </div>
        </div>

        <div className="admin-login-heading">
          <p>Espace sécurisé</p>
          <h1>Connexion administrateur</h1>
          <span>
            Gérez les lieux, activités, hébergements,
            restaurants et leurs images.
          </span>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label>
            Adresse e-mail
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>

          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            <LogIn size={19} />

            {loading
              ? "Connexion en cours…"
              : "Se connecter"}
          </button>
        </form>

        <button
          type="button"
          className="admin-login-back"
          onClick={() => navigate("/")}
        >
          Retourner sur le site
        </button>
      </section>
    </main>
  );
}
