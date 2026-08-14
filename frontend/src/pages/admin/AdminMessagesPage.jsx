import {
  useEffect,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  RefreshCw,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getAdminContactMessage,
  getAdminContactMessages,
  getCurrentUser,
  logoutAdmin,
  toggleAdminContactMessageRead,
} from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./AdminDashboardPage.css";
import "./AdminMessagesPage.css";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getFullName(message) {
  return [
    message.firstname,
    message.lastname,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function AdminMessagesPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    unread: 0,
    read: 0,
  });
  const [selectedMessage, setSelectedMessage] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  async function loadMessages() {
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

      const data = await getAdminContactMessages();

      setMessages(data.items ?? []);
      setStatistics(
        data.statistics ?? {
          total: 0,
          unread: 0,
          read: 0,
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
          "Impossible de charger les messages."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleOpen(message) {
    setOpeningId(message.id);
    setError("");

    try {
      const data = await getAdminContactMessage(
        message.id
      );

      setSelectedMessage(data.item);

      if (!message.isRead) {
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage.id === message.id
              ? data.item
              : currentMessage
          )
        );

        setStatistics((currentStatistics) => ({
          ...currentStatistics,
          unread: Math.max(
            0,
            currentStatistics.unread - 1
          ),
          read: currentStatistics.read + 1,
        }));
      }
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible d’ouvrir ce message."
      );
    } finally {
      setOpeningId(null);
    }
  }

  async function handleToggle(message) {
    setUpdatingId(message.id);
    setError("");

    try {
      const data =
        await toggleAdminContactMessageRead(
          message.id
        );

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id
            ? data.item
            : currentMessage
        )
      );

      if (selectedMessage?.id === message.id) {
        setSelectedMessage(data.item);
      }

      setStatistics((currentStatistics) => ({
        ...currentStatistics,
        unread:
          currentStatistics.unread +
          (data.item.isRead ? -1 : 1),
        read:
          currentStatistics.read +
          (data.item.isRead ? 1 : -1),
      }));
    } catch (requestError) {
      setError(
        requestError.message ??
          "Impossible de modifier ce message."
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
            type="button"
            onClick={() =>
              navigate("/admin/newsletter")
            }
          >
            <Mail size={18} />
            Newsletter
          </button>

          <button
            className="active"
            type="button"
          >
            <MessageSquare size={18} />
            Messages
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
            <h1>Messages reçus</h1>

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
            <span>Non lus</span>
            <strong>{statistics.unread}</strong>
          </article>

          <article>
            <span>Lus</span>
            <strong>{statistics.read}</strong>
          </article>
        </div>

        <section className="admin-content-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Boîte de réception</h2>

              <span>
                {messages.length} message
                {messages.length > 1 ? "s" : ""}
              </span>
            </div>

            <button
              type="button"
              onClick={loadMessages}
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
              Chargement des messages…
            </div>
          ) : messages.length === 0 ? (
            <div className="admin-empty">
              Aucun message pour le moment.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-content-table">
                <thead>
                  <tr>
                    <th>Expéditeur</th>
                    <th>Objet</th>
                    <th>Date</th>
                    <th>État</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>

                <tbody>
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className={
                        !message.isRead
                          ? "admin-message-unread"
                          : undefined
                      }
                    >
                      <td>
                        <strong>
                          {getFullName(message)}
                        </strong>

                        <span>{message.email}</span>
                      </td>

                      <td>{message.subject}</td>

                      <td>
                        {formatDate(message.createdAt)}
                      </td>

                      <td>
                        <span
                          className={
                            message.isRead
                              ? "status published"
                              : "status draft"
                          }
                        >
                          {message.isRead
                            ? "Lu"
                            : "Non lu"}
                        </span>
                      </td>

                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpen(message)
                            }
                            disabled={
                              openingId === message.id
                            }
                            title="Lire le message"
                            aria-label="Lire le message"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(message)
                            }
                            disabled={
                              updatingId === message.id
                            }
                            title={
                              message.isRead
                                ? "Marquer comme non lu"
                                : "Marquer comme lu"
                            }
                            aria-label={
                              message.isRead
                                ? "Marquer comme non lu"
                                : "Marquer comme lu"
                            }
                          >
                            {message.isRead ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
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

      {selectedMessage && (
        <div
          className="admin-message-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-title"
        >
          <button
            type="button"
            className="admin-message-backdrop"
            onClick={() =>
              setSelectedMessage(null)
            }
            aria-label="Fermer"
          />

          <article className="admin-message-dialog">
            <header>
              <div>
                <span>Message reçu</span>

                <h2 id="message-title">
                  {selectedMessage.subject}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </header>

            <div className="admin-message-sender">
              <div>
                <strong>
                  {getFullName(selectedMessage)}
                </strong>

                <a
                  href={`mailto:${selectedMessage.email}`}
                >
                  {selectedMessage.email}
                </a>
              </div>

              <time>
                {formatDate(
                  selectedMessage.createdAt
                )}
              </time>
            </div>

            <div className="admin-message-body">
              {selectedMessage.message}
            </div>

            <footer>
              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                  `Re: ${selectedMessage.subject}`
                )}`}
              >
                <Mail size={18} />
                Répondre par e-mail
              </a>
            </footer>
          </article>
        </div>
      )}
    </main>
  );
}