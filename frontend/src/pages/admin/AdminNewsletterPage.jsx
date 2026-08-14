import {
  useEffect,
  useState,
} from "react";
import {
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminNewsletterSubscribers,
  getCurrentUser,
  logoutAdmin,
  toggleNewsletterSubscriber,
} from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AdminDashboardPage.css";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminNewsletterPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function loadSubscribers() {
    setLoading(true);
    setError("");

    try {
      const userData = await getCurrentUser();

      if (
        !userData?.user?.roles?.includes("ROLE_ADMIN")
      ) {
        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setUser(userData.user);

      const data =
        await getAdminNewsletterSubscribers();

      setSubscribers(data.items ?? []);
      setStatistics(
        data.statistics ?? {
          total: 0,
          active: 0,
          inactive: 0,
        }
      );
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        requestError.message ??
          "Impossible de charger les abonnés."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function handleToggle(subscriber) {
    setUpdatingId(subscriber.id);
    setError("");

    try {
      const data =
        await toggleNewsletterSubscriber(
          subscriber.id
        );

      setSubscribers((currentSubscribers) =>
        currentSubscribers.map((currentSubscriber) =>
          currentSubscriber.id === subscriber.id
            ? data.item
            : currentSubscriber
        )
      );

      setStatistics((currentStatistics) => ({
        ...currentStatistics,
        active:
          currentStatistics.active +
          (data.item.isActive ? 1 : -1),
        inactive:
          currentStatistics.inactive +
          (data.item.isActive ? -1 : 1),
      }));
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible de modifier cet abonnement."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      navigate("/admin/login", {
        replace: true,
      });
    }
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>
            <MapPin size={23} />
          </span>

          <div>
            <strong>DakhlaPlace</strong>
            <small>Administration</small>
          </div>
        </div>

        <nav>
          <button
            type="button"
            onClick={() => navigate("/admin")}
          >
            <MapPin size={18} />
            Contenus
          </button>

          <button
            className="active"
            type="button"
          >
            <Mail size={18} />
            Newsletter
          </button>
        </nav>

        <button
          className="admin-sidebar-logout"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-main-header">
          <div>
            <span>Tableau de bord</span>
            <h1>Abonnés à la newsletter</h1>

            <p>
              {user
                ? `Connectée avec ${user.email}`
                : "Chargement de votre session…"}
            </p>
          </div>
        </header>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        <div className="admin-stat-grid">
          <article>
            <span>Total</span>
            <strong>{statistics.total}</strong>
          </article>

          <article>
            <span>Actifs</span>
            <strong>{statistics.active}</strong>
          </article>

          <article>
            <span>Désinscrits</span>
            <strong>{statistics.inactive}</strong>
          </article>
        </div>

        <section className="admin-content-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Adresses e-mail</h2>
              <span>
                {subscribers.length} abonné
                {subscribers.length > 1 ? "s" : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={loadSubscribers}
              disabled={loading}
              aria-label="Actualiser"
            >
              <RefreshCw
                size={18}
                className={
                  loading ? "spinning" : ""
                }
              />
            </button>
          </div>

          {loading ? (
            <div className="admin-empty">
              Chargement des abonnés…
            </div>
          ) : subscribers.length === 0 ? (
            <div className="admin-empty">
              Aucun abonné pour le moment.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-content-table">
                <thead>
                  <tr>
                    <th>Adresse e-mail</th>
                    <th>Inscription</th>
                    <th>État</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id}>
                      <td>
                        <strong>
                          {subscriber.email}
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          subscriber.createdAt
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            subscriber.isActive
                              ? "status published"
                              : "status draft"
                          }
                        >
                          {subscriber.isActive
                            ? "Actif"
                            : "Désinscrit"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              subscriber.id
                            }
                            onClick={() =>
                              handleToggle(subscriber)
                            }
                            aria-label={
                              subscriber.isActive
                                ? "Désactiver"
                                : "Réactiver"
                            }
                            title={
                              subscriber.isActive
                                ? "Désactiver"
                                : "Réactiver"
                            }
                          >
                            {subscriber.isActive ? (
                              <ToggleRight size={20} />
                            ) : (
                              <ToggleLeft size={20} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}