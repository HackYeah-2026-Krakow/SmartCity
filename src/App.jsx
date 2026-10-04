import { useState } from "react";
import Sidebar from "./components/Sidebar"; // adjust path to your Sidebar
import CityImpactPage from "./page/CityImpactPage";
import LiveTrafficPage from "./page/LiveTrafficPage";
import ExportReport from "./page/ExportReport";

const simplePages = {
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

function SimpleConsolePage({ page }) {
  const content = simplePages[page] || simplePages.reports;

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar: fixed height, never scrolls */}
      <header className="flex h-[64px] shrink-0 items-center border-b border-[#e1e7e3] bg-white px-[42px]">
        <h1 className="text-[20px] font-bold text-[#111613]">
          {content.title}
        </h1>
      </header>

      {/* Only this area scrolls if content overflows */}
      <div className="min-h-0 flex-1 overflow-y-auto p-[42px] max-[800px]:p-[25px]">
        <p className="mb-[30px] text-[14px] text-[#66716a]">
          {content.description}
        </p>

        <div className="grid max-w-[900px] grid-cols-3 gap-[15px] max-[800px]:grid-cols-1">
          {content.cards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-[14px] border border-[#e1e7e3] bg-white p-[22px]"
            >
              <span className="mb-[10px] block text-[11px] text-[#758079]">
                {label}
              </span>
              <strong className="text-[25px] text-[#111613]">{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("city-impact");
  const [range, setRange] = useState('30d');
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'report'


  if (view === 'report') {
    return <ExportReport range={range} onBack={() => setView('dashboard')} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case "city-impact":
        return <CityImpactPage range={range} setRange={setRange} onExport={() => setView('report')}  />;
      case "live-traffic":
        return <LiveTrafficPage />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef2f0] font-sans text-[#151a17]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <main className="h-full min-w-0 flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;