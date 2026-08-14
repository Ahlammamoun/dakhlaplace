import {
  Globe2,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const ADMIN_LINKS = [
  {
    label: "Contenus",
    path: "/admin",
    icon: MapPin,
    exact: true,
  },
  {
    label: "Newsletter",
    path: "/admin/newsletter",
    icon: Mail,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Réseaux sociaux",
    path: "/admin/social-networks",
    icon: Globe2,
  },
];

export default function AdminSidebar({
  navigate,
  onLogout,
}) {
  const { pathname } = useLocation();

  function isActive(link) {
    if (link.exact) {
      return pathname === link.path;
    }

    return pathname.startsWith(link.path);
  }

  return (
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
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon;

          return (
            <button
              className={
                isActive(link)
                  ? "active"
                  : undefined
              }
              type="button"
              onClick={() =>
                navigate(link.path)
              }
              key={link.path}
            >
              <Icon size={18} />
              {link.label}
            </button>
          );
        })}
      </nav>

      <button
        className="admin-sidebar-logout"
        type="button"
        onClick={onLogout}
      >
        <LogOut size={18} />
        Se déconnecter
      </button>
    </aside>
  );
}
