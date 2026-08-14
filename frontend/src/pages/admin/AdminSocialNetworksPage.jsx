import {
  useEffect,
  useState,
} from "react";
import {
  Edit3,
  Globe2,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  createAdminSocialNetwork,
  deleteAdminSocialNetwork,
  getAdminSocialNetworks,
  getCurrentUser,
  logoutAdmin,
  updateAdminSocialNetwork,
} from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AdminDashboardPage.css";
import "./AdminSocialNetworksPage.css";

const EMPTY_FORM = {
  name: "",
  platform: "instagram",
  url: "",
  position: 0,
  isActive: true,
};

const PLATFORM_LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
};

export default function AdminSocialNetworksPage() {
  const navigate = useNavigate();

  const [networks, setNetworks] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpened, setFormOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadNetworks() {
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

      const data = await getAdminSocialNetworks();
      setNetworks(data.items ?? []);
    } catch (requestError) {
      if (requestError.status === 401) {
        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        requestError.message ??
          "Impossible de charger les réseaux sociaux."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNetworks();
  }, []);

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  }

  function openCreationForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpened(true);
    setError("");
    setSuccess("");
  }

  function openEditionForm(network) {
    setEditingId(network.id);
    setForm({
      name: network.name,
      platform: network.platform,
      url: network.url,
      position: network.position,
      isActive: network.isActive,
    });
    setFormOpened(true);
    setError("");
    setSuccess("");
  }

  function closeForm() {
    setFormOpened(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      position: Number(form.position) || 0,
    };

    try {
      if (editingId) {
        await updateAdminSocialNetwork(
          editingId,
          payload
        );

        setSuccess("Réseau social modifié.");
      } else {
        await createAdminSocialNetwork(payload);
        setSuccess("Réseau social ajouté.");
      }

      closeForm();
      await loadNetworks();
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible d’enregistrer ce réseau."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(network) {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${network.name} » ?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(network.id);
    setError("");

    try {
      await deleteAdminSocialNetwork(network.id);

      setNetworks((currentNetworks) =>
        currentNetworks.filter(
          (currentNetwork) =>
            currentNetwork.id !== network.id
        )
      );
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible de supprimer ce réseau."
      );
    } finally {
      setDeletingId(null);
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
            type="button"
            onClick={() =>
              navigate("/admin/newsletter")
            }
          >
            <Mail size={18} />
            Newsletter
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/messages")
            }
          >
            <MessageSquare size={18} />
            Messages
          </button>

          <button
            className="active"
            type="button"
          >
            <Globe2 size={18} />
            Réseaux sociaux
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
            <h1>Réseaux sociaux</h1>

            <p>
              Gérez les liens affichés dans le footer.
            </p>
          </div>

          <button
            className="admin-add-button"
            type="button"
            onClick={openCreationForm}
          >
            <Plus size={19} />
            Ajouter un réseau
          </button>
        </header>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-social-success">
            {success}
          </div>
        )}

        <div className="admin-stat-grid">
          <article>
            <span>Total</span>
            <strong>{networks.length}</strong>
          </article>

          <article>
            <span>Actifs</span>
            <strong>
              {
                networks.filter(
                  (network) => network.isActive
                ).length
              }
            </strong>
          </article>

          <article>
            <span>Inactifs</span>
            <strong>
              {
                networks.filter(
                  (network) => !network.isActive
                ).length
              }
            </strong>
          </article>
        </div>

        <section className="admin-content-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Liens configurés</h2>
              <span>
                {networks.length} réseau
                {networks.length > 1 ? "x" : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={loadNetworks}
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
              Chargement des réseaux…
            </div>
          ) : networks.length === 0 ? (
            <div className="admin-empty">
              Aucun réseau configuré.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-content-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Plateforme</th>
                    <th>URL</th>
                    <th>Position</th>
                    <th>État</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {networks.map((network) => (
                    <tr key={network.id}>
                      <td>
                        <strong>{network.name}</strong>
                      </td>

                      <td>
                        {PLATFORM_LABELS[
                          network.platform
                        ] ?? network.platform}
                      </td>

                      <td>
                        <a
                          href={network.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {network.url}
                        </a>
                      </td>

                      <td>{network.position}</td>

                      <td>
                        <span
                          className={
                            network.isActive
                              ? "status published"
                              : "status draft"
                          }
                        >
                          {network.isActive
                            ? "Actif"
                            : "Inactif"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            onClick={() =>
                              openEditionForm(network)
                            }
                            aria-label={`Modifier ${network.name}`}
                          >
                            <Edit3 size={17} />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            disabled={
                              deletingId === network.id
                            }
                            onClick={() =>
                              handleDelete(network)
                            }
                            aria-label={`Supprimer ${network.name}`}
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

      {formOpened && (
        <div className="admin-social-modal">
          <button
            type="button"
            className="admin-social-backdrop"
            onClick={closeForm}
            aria-label="Fermer"
          />

          <form
            className="admin-social-dialog"
            onSubmit={handleSubmit}
          >
            <header>
              <div>
                <span>Réseau social</span>

                <h2>
                  {editingId
                    ? "Modifier le réseau"
                    : "Ajouter un réseau"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-social-form">
              <label>
                Nom *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Instagram Dakhla Place"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Plateforme *
                <select
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                >
                  {Object.entries(
                    PLATFORM_LABELS
                  ).map(([value, label]) => (
                    <option
                      value={value}
                      key={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                URL *
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://..."
                  maxLength={500}
                  required
                />
              </label>

              <label>
                Position
                <input
                  type="number"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  min="0"
                />
              </label>

              <label className="admin-social-checkbox">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />

                Afficher ce réseau dans le footer
              </label>
            </div>

            <footer>
              <button
                type="button"
                onClick={closeForm}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Enregistrement…"
                  : "Enregistrer"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}