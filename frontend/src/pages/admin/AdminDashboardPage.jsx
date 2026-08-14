import { useEffect, useState } from "react";
import {
  Edit3,
  Image,
  LogOut,
  MapPin,
  Plus,
  RefreshCw,
  Trash2,
  Mail,
  MessageSquare, 
  Globe2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  deleteAdminContent,
  getAdminContents,
  getCurrentUser,
  logoutAdmin,
} from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AdminDashboardPage.css";

const TYPE_LABELS = {
  place: "Lieu",
  activity: "Activité",
  accommodation: "Hébergement",
  restaurant: "Restaurant",
  article: "Article",
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadDashboard() {
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

      const contentData = await getAdminContents();
      setItems(contentData.items ?? []);
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        requestError.message ??
        "Impossible de charger l’administration."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      await logoutAdmin();
    } finally {
      navigate("/admin/login", {
        replace: true,
      });
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${item.title} » et ses images ?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    setError("");

    try {
      await deleteAdminContent(item.id);

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.id !== item.id
        )
      );
    } catch (requestError) {
      setError(
        requestError.message ??
        "Impossible de supprimer ce contenu."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="admin-dashboard">
      <AdminSidebar
  navigate={navigate}
  onLogout={handleLogout}
/>

      <section className="admin-main">
        <header className="admin-main-header">
          <div>
            <span>Tableau de bord</span>
            <h1>Gestion des contenus</h1>
            <p>
              {user
                ? `Connectée avec ${user.email}`
                : "Chargement de votre session…"}
            </p>
          </div>

          <button
            className="admin-add-button"
            type="button"
            onClick={() =>
              navigate("/admin/content/new")
            }
          >
            <Plus size={19} />
            Ajouter un contenu
          </button>
        </header>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        <div className="admin-stat-grid">
          <article>
            <span>Contenus</span>
            <strong>{items.length}</strong>
          </article>

          <article>
            <span>Publiés</span>
            <strong>
              {
                items.filter(
                  (item) => item.isPublished
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Mis en avant</span>
            <strong>
              {
                items.filter(
                  (item) => item.isFeatured
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Images</span>
            <strong>
              {items.reduce(
                (total, item) =>
                  total + (item.imagesCount ?? 0),
                0
              )}
            </strong>
          </article>
        </div>

        <section className="admin-content-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Tous les contenus</h2>
              <span>
                {items.length} élément
                {items.length > 1 ? "s" : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              aria-label="Actualiser"
            >
              <RefreshCw
                size={18}
                className={loading ? "spinning" : ""}
              />
            </button>
          </div>

          {loading ? (
            <div className="admin-empty">
              Chargement des contenus…
            </div>
          ) : items.length === 0 ? (
            <div className="admin-empty">
              Aucun contenu pour le moment.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-content-table">
                <thead>
                  <tr>
                    <th>Contenu</th>
                    <th>Type</th>
                    <th>État</th>
                    <th>Images</th>
                    <th>Position</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.title}</strong>
                        <span>/{item.slug}</span>
                      </td>

                      <td>
                        {TYPE_LABELS[item.type] ??
                          item.type}
                      </td>

                      <td>
                        <span
                          className={
                            item.isPublished
                              ? "status published"
                              : "status draft"
                          }
                        >
                          {item.isPublished
                            ? "Publié"
                            : "Brouillon"}
                        </span>
                      </td>

                      <td>
                        <span className="image-count">
                          <Image size={16} />
                          {item.imagesCount ?? 0}
                        </span>
                      </td>

                      <td>{item.position}</td>

                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            aria-label={`Modifier ${item.title}`}
                            onClick={() =>
                              navigate(
                                `/admin/content/${item.id}/edit`
                              )
                            }
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            aria-label={`Supprimer ${item.title}`}
                            disabled={
                              deletingId === item.id
                            }
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <Trash2 size={17} />
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
