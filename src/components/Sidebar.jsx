import React from "react";

const navigationItems = [
  {
    id: "city-impact",
    label: "City Impact",
    icon: "▥",
  },
  {
    id: "live-traffic",
    label: "Live Traffic",
    icon: "⌁",
  },
  {
    id: "rewards-programme",
    label: "Rewards programme",
    icon: "☆",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "▤",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "☷",
  },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <span className="brand-leaf brand-leaf-one" />
          <span className="brand-leaf brand-leaf-two" />
          <span className="brand-wheel">◉</span>
        </div>

        <span className="brand-name">GreenPace IQ</span>
      </div>

      <div className="sidebar-label">CITY CONSOLE</div>

      <nav className="sidebar-navigation">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar-navigation-item ${
              activePage === item.id ? "active" : ""
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="sidebar-navigation-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">MO</div>

        <div>
          <strong>Mobility Office</strong>
          <span>City administrator</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;