import React, { useState } from "react";
import CityImpactPage from "./page/CityImpactPage";
import LiveTrafficPage from "./page/LiveTrafficPage";

function SimpleConsolePage({ page, onNavigate }) {
  const pageContent = {
    "rewards-programme": {
      title: "Rewards programme",
      description:
        "Manage GreenPace rewards, driver engagement and mobility incentives.",
      cards: [
        ["Active participants", "8,420"],
        ["Rewards issued", "24,680"],
        ["Redemptions", "18,240"],
      ],
    },
    reports: {
      title: "Reports",
      description:
        "Generate and review mobility, traffic and sustainability reports.",
      cards: [
        ["Monthly reports", "12"],
        ["Generated this year", "84"],
        ["Scheduled reports", "6"],
      ],
    },
    settings: {
      title: "Settings",
      description:
        "Configure city mobility preferences, notifications and data sources.",
      cards: [
        ["Data refresh", "30 sec"],
        ["Connected sources", "8"],
        ["Alert rules", "14"],
      ],
    },
  };

  const content = pageContent[page] || pageContent.reports;

  return (
    <div className="console-page">
      <style>{`
        .console-page {
          min-height: 100vh;
          display: flex;
          background: #eef2f0;
          color: #151a17;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .console-main {
          flex: 1;
          padding: 42px;
        }

        .console-main h1 {
          color: #111613;
          font-size: 32px;
          line-height: 1.1;
          margin: 0;
        }

        .console-main > p {
          color: #66716a;
          margin: 10px 0 30px;
          font-size: 14px;
        }

        .console-card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
          max-width: 900px;
        }

        .console-card {
          background: #fff;
          border: 1px solid #e1e7e3;
          border-radius: 14px;
          padding: 22px;
        }

        .console-card span {
          color: #758079;
          display: block;
          font-size: 11px;
          margin-bottom: 10px;
        }

        .console-card strong {
          color: #111613;
          font-size: 25px;
        }

        @media (max-width: 800px) {
          .console-card-grid {
            grid-template-columns: 1fr;
          }

          .console-main {
            padding: 25px;
          }
        }
      `}</style>

      <ConsoleSidebar activePage={page} onNavigate={onNavigate} />

      <main className="console-main">
        <h1>{content.title}</h1>
        <p>{content.description}</p>

        <div className="console-card-grid">
          {content.cards.map(([label, value]) => (
            <div className="console-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ConsoleSidebar({ activePage, onNavigate }) {
  const items = [
    { id: "city-impact", label: "City Impact", icon: "▥" },
    { id: "live-traffic", label: "Live Traffic", icon: "⌁" },
    {
      id: "rewards-programme",
      label: "Rewards programme",
      icon: "☆",
    },
    { id: "reports", label: "Reports", icon: "▤" },
    { id: "settings", label: "Settings", icon: "☷" },
  ];

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        background: "#fff",
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        borderRight: "1px solid #e5eae7",
      }}
    >
      <div
        style={{
          color: "#299548",
          fontSize: "16px",
          fontWeight: 800,
          padding: "0 10px 30px",
        }}
      >
        GreenPace IQ
      </div>

      <div
        style={{
          fontSize: "9px",
          letterSpacing: "1.3px",
          color: "#758079",
          fontWeight: 700,
          padding: "0 10px 9px",
        }}
      >
        CITY CONSOLE
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            style={{
              width: "100%",
              border: 0,
              borderRadius: "9px",
              padding: "11px 12px",
              marginBottom: "3px",
              background:
                activePage === item.id ? "#101411" : "transparent",
              color: activePage === item.id ? "#fff" : "#4d5751",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "12px",
            }}
          >
            <span style={{ width: "18px" }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div
        style={{
          marginTop: "auto",
          background: "#f3f6f4",
          borderRadius: "10px",
          padding: "12px",
        }}
      >
        <strong style={{ fontSize: "10px", color: "#111613" }}>
          Mobility Office
        </strong>

        <span
          style={{
            display: "block",
            fontSize: "8px",
            color: "#7a847e",
            marginTop: "3px",
          }}
        >
          City administrator
        </span>
      </div>
    </aside>
  );
}

function App() {
  const [activePage, setActivePage] = useState("city-impact");

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  if (
    activePage === "rewards-programme" ||
    activePage === "reports" ||
    activePage === "settings"
  ) {
    return (
      <SimpleConsolePage
        page={activePage}
        onNavigate={handleNavigate}
      />
    );
  }

  if (activePage === "live-traffic") {
    return <LiveTrafficPage onNavigate={handleNavigate} />;
  }

  return <CityImpactPage onNavigate={handleNavigate} />;
}

export default App;