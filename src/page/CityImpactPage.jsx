import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import ImpactMetricCard from "../components/ImpactMetricCard";

const districtData = [
  { name: "City Centre", value: 34 },
  { name: "North", value: 22 },
  { name: "East", value: 18 },
  { name: "South", value: 15 },
  { name: "West", value: 11 },
];

const monthlyUsers = [
  6200, 7000, 7800, 9000, 10500, 11200, 12600, 13900, 15100, 15800,
  16400, 18420,
];

function CityImpactPage({ onNavigate }) {
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="city-impact-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .city-impact-page {
          min-height: 100vh;
          background: #f5f6f5;
          color: #151a17;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          display: flex;
          overflow: hidden;
        }

        .app-sidebar {
          width: 198px;
          min-width: 198px;
          background: #ffffff;
          min-height: 100vh;
          padding: 22px 10px 14px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #eef0ee;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 5px 22px;
        }

        .brand-name {
          font-size: 13px;
          font-weight: 800;
          color: #299548;
          white-space: nowrap;
        }

        .brand-mark {
          position: relative;
          width: 25px;
          height: 25px;
        }

        .brand-leaf {
          position: absolute;
          width: 15px;
          height: 7px;
          border-radius: 100% 0 100% 0;
          border: 2px solid #2b9c4b;
          transform: rotate(-25deg);
        }

        .brand-leaf-one {
          left: 0;
          top: 2px;
        }

        .brand-leaf-two {
          right: 0;
          top: 9px;
          transform: rotate(35deg);
        }

        .brand-wheel {
          position: absolute;
          right: 2px;
          bottom: 0;
          font-size: 10px;
          color: #161a17;
        }

        .sidebar-label {
          padding: 0 7px;
          color: #717a74;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.3px;
          margin-bottom: 8px;
        }

        .sidebar-navigation {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-navigation-item {
          border: 0;
          background: transparent;
          padding: 10px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #505954;
          font-size: 11px;
          text-align: left;
          cursor: pointer;
        }

        .sidebar-navigation-item:hover {
          background: #f2f5f3;
        }

        .sidebar-navigation-item.active {
          background: #101411;
          color: #ffffff;
        }

        .sidebar-navigation-icon {
          width: 15px;
          text-align: center;
          font-size: 15px;
        }

        .sidebar-user {
          margin-top: auto;
          background: #f5f7f5;
          border-radius: 9px;
          padding: 9px 8px;
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .user-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0b1110;
          color: #31ea91;
          display: grid;
          place-items: center;
          font-size: 7px;
          font-weight: 800;
        }

        .sidebar-user strong,
        .sidebar-user span {
          display: block;
        }

        .sidebar-user strong {
          font-size: 8px;
        }

        .sidebar-user span {
          color: #8a928c;
          font-size: 7px;
          margin-top: 2px;
        }

        .city-impact-content {
          flex: 1;
          min-width: 0;
          padding: 14px 18px;
          background: #edf1ef;
        }

        .city-impact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .city-impact-header h1 {
          font-size: 17px;
          margin: 0;
          font-weight: 750;
        }

        .city-impact-header p {
          margin: 4px 0 0;
          color: #68716c;
          font-size: 9px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .period-switcher,
        .export-button {
          background: #ffffff;
          border: 1px solid #e4e8e5;
          border-radius: 7px;
          padding: 6px 9px;
          font-size: 8px;
          color: #5d6660;
        }

        .period-switcher {
          display: flex;
          gap: 3px;
        }

        .period-switcher button {
          border: 0;
          background: transparent;
          border-radius: 5px;
          padding: 4px 7px;
          font-size: 8px;
          cursor: pointer;
        }

        .period-switcher button.active {
          background: #111613;
          color: white;
        }

        .export-button {
          cursor: pointer;
          font-weight: 600;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 10px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 10px;
          min-height: 68px;
          border: 1px solid #edf0ed;
        }

        .stat-card-label {
          color: #78807a;
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: .5px;
        }

        .stat-card-value {
          margin-top: 4px;
          font-size: 20px;
          line-height: 1;
          font-weight: 750;
        }

        .stat-card-value span {
          font-size: 10px;
          margin-left: 2px;
        }

        .stat-card-change {
          margin-top: 6px;
          display: inline-flex;
          gap: 2px;
          color: #14844a;
          background: #dcf7e9;
          border-radius: 5px;
          padding: 2px 5px;
          font-size: 7px;
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(280px, .95fr);
          gap: 9px;
        }

        .panel {
          background: #ffffff;
          border: 1px solid #e8ece9;
          border-radius: 11px;
        }

        .adoption-panel {
          padding: 10px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .panel-title {
          font-size: 9px;
          font-weight: 800;
        }

        .panel-subtitle {
          font-size: 7px;
          color: #818a84;
          margin-top: 2px;
        }

        .chart-switcher {
          display: flex;
          background: #f2f5f3;
          border-radius: 7px;
          padding: 2px;
        }

        .chart-switcher button {
          border: 0;
          background: transparent;
          padding: 4px 7px;
          border-radius: 5px;
          font-size: 7px;
          cursor: pointer;
        }

        .chart-switcher button.active {
          background: #101411;
          color: white;
        }

        .line-chart {
          height: 145px;
          position: relative;
          padding: 15px 8px 15px 28px;
          overflow: hidden;
        }

        .chart-grid-line {
          position: absolute;
          left: 28px;
          right: 7px;
          height: 1px;
          background: #edf0ee;
        }

        .chart-grid-line:nth-child(1) { top: 15px; }
        .chart-grid-line:nth-child(2) { top: 45px; }
        .chart-grid-line:nth-child(3) { top: 75px; }
        .chart-grid-line:nth-child(4) { top: 105px; }
        .chart-grid-line:nth-child(5) { top: 135px; }

        .chart-y-labels {
          position: absolute;
          left: 0;
          top: 7px;
          bottom: 5px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #8a928c;
          font-size: 6px;
        }

        .chart-svg {
          position: absolute;
          left: 29px;
          right: 7px;
          top: 14px;
          width: calc(100% - 36px);
          height: 122px;
        }

        .chart-x-labels {
          position: absolute;
          left: 30px;
          right: 5px;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          color: #8a928c;
          font-size: 6px;
        }

        .chart-end-value {
          position: absolute;
          right: 2px;
          top: 15px;
          background: #111613;
          color: white;
          padding: 3px 5px;
          border-radius: 5px;
          font-size: 7px;
          font-weight: 700;
        }

        .mini-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 5px;
        }

        .mini-stat {
          background: #f3f5f4;
          border-radius: 8px;
          padding: 8px;
        }

        .mini-stat strong {
          display: block;
          font-size: 11px;
        }

        .mini-stat span {
          color: #858d87;
          font-size: 6px;
        }

        .district-section {
          margin-top: 12px;
        }

        .district-heading {
          display: flex;
          justify-content: space-between;
          font-size: 7px;
          margin-bottom: 6px;
        }

        .district-heading span {
          color: #838b85;
        }

        .district-row {
          display: grid;
          grid-template-columns: 52px 1fr 25px;
          align-items: center;
          gap: 5px;
          margin-bottom: 6px;
          font-size: 7px;
        }

        .district-track {
          height: 4px;
          background: #e0e5e2;
          border-radius: 20px;
          overflow: hidden;
        }

        .district-fill {
          height: 100%;
          background: #2be78a;
          border-radius: inherit;
        }

        .district-value {
          text-align: right;
          color: #555e58;
        }

        .impact-panel {
          padding: 10px;
        }

        .impact-metric-card {
          background: #f3f5f4;
          border-radius: 10px;
          padding: 10px;
          margin-top: 8px;
        }

        .impact-metric-header {
          display: flex;
          justify-content: space-between;
          gap: 5px;
        }

        .impact-metric-header h3 {
          font-size: 8px;
          margin: 0;
        }

        .impact-metric-header span {
          display: block;
          font-size: 6px;
          color: #7b847e;
          margin-top: 2px;
        }

        .impact-metric-badge {
          color: #07824a !important;
          background: #dcf7e9;
          border-radius: 5px;
          padding: 3px 5px;
          height: fit-content;
          font-weight: 700;
        }

        .impact-metric-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          margin-top: 9px;
        }

        .impact-metric-values span {
          display: block;
          font-size: 5px;
          color: #858d87;
        }

        .impact-metric-values strong {
          display: block;
          font-size: 9px;
          margin-top: 2px;
        }

        .impact-progress {
          margin-top: 8px;
          height: 4px;
          border-radius: 20px;
          background: #dce2df;
          overflow: hidden;
        }

        .impact-progress-value {
          height: 100%;
          background: #2be78a;
          border-radius: inherit;
        }

        .impact-progress-label {
          color: #7e8781;
          font-size: 5px;
          margin-top: 4px;
        }

        .dashboard-footer {
          margin-top: 9px;
          background: #ffffff;
          border: 1px solid #e8ece9;
          border-radius: 11px;
          min-height: 68px;
          display: grid;
          grid-template-columns: 145px repeat(4, 1fr);
          align-items: center;
          padding: 9px 14px;
        }

        .mobility-score {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .score-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 5px solid #dce5df;
          border-top-color: #29e889;
          border-right-color: #29e889;
          display: grid;
          place-items: center;
          font-size: 8px;
        }

        .mobility-score strong {
          font-size: 21px;
        }

        .mobility-score span {
          font-size: 6px;
          color: #777f79;
        }

        .footer-metric {
          border-left: 1px solid #e8ece9;
          padding-left: 14px;
        }

        .footer-metric strong {
          display: block;
          color: #0a8247;
          font-size: 14px;
        }

        .footer-metric span {
          color: #778079;
          font-size: 6px;
        }

        .footer-progress {
          margin-top: 4px;
          width: 65px;
          height: 3px;
          border-radius: 10px;
          background: #dfe4e1;
        }

        .footer-progress::after {
          content: "";
          display: block;
          height: 100%;
          width: 64%;
          background: #2be78a;
          border-radius: inherit;
        }

        @media (max-width: 900px) {
          .app-sidebar {
            width: 70px;
            min-width: 70px;
          }

          .brand-name,
          .sidebar-label,
          .sidebar-navigation-item span:last-child,
          .sidebar-user > div:last-child {
            display: none;
          }

          .sidebar-navigation-item {
            justify-content: center;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <Sidebar activePage="city-impact" onNavigate={onNavigate} />

      <main className="city-impact-content">
        <header className="city-impact-header">
          <div>
            <h1>City Impact Dashboard</h1>
            <p>
              Are people using GreenPace IQ — and is it helping us reach city
              goals?
            </p>
          </div>

          <div className="header-actions">
            <div className="period-switcher">
              {["7 days", "30 days", "12 months"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === "30 days" ? "active" : ""}
                >
                  {item}
                </button>
              ))}
            </div>

            <button className="export-button" type="button">
              ↓ &nbsp; Export report
            </button>
          </div>
        </header>

        <section className="stat-grid">
          <StatCard label="Active users" value="18,420" change="+12.4%" />
          <StatCard label="Total users" value="46,900" change="+8.1%" />
          <StatCard label="Trips analysed" value="1.28M" change="+15.3%" />
          <StatCard
            label="Average daily usage"
            value="26"
            suffix="min"
            change="+6.5%"
          />
          <StatCard label="Share of drivers" value="14.2%" change="+1.6 pp" />
        </section>

        <section className="dashboard-grid">
          <div className="panel adoption-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Adoption & usage</div>
                <div className="panel-subtitle">
                  Monthly active users, last 12 months
                </div>
              </div>

              <div className="chart-switcher">
                {["Daily", "Weekly", "Monthly"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={period === item ? "active" : ""}
                    onClick={() => setPeriod(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="line-chart">
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />
              <div className="chart-grid-line" />

              <div className="chart-y-labels">
                <span>20k</span>
                <span>15k</span>
                <span>10k</span>
                <span>5k</span>
                <span>0</span>
              </div>

              <svg
                className="chart-svg"
                viewBox="0 0 700 120"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="user-area" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="#2be889"
                      stopOpacity=".25"
                    />
                    <stop
                      offset="100%"
                      stopColor="#2be889"
                      stopOpacity=".03"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 96 L64 88 L128 80 L192 69 L256 59 L320 54 L384 44 L448 35 L512 26 L576 22 L640 10 L700 4 L700 120 L0 120 Z"
                  fill="url(#user-area)"
                />

                <path
                  d="M0 96 L64 88 L128 80 L192 69 L256 59 L320 54 L384 44 L448 35 L512 26 L576 22 L640 10 L700 4"
                  fill="none"
                  stroke="#12a85c"
                  strokeWidth="2"
                />

                <circle
                  cx="700"
                  cy="4"
                  r="4"
                  fill="#ffffff"
                  stroke="#12a85c"
                  strokeWidth="2"
                />
              </svg>

              <div className="chart-end-value">18,420</div>

              <div className="chart-x-labels">
                {[
                  "Nov",
                  "Dec",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <strong>6,240</strong>
                <span>Daily active users</span>
              </div>
              <div className="mini-stat">
                <strong>12,870</strong>
                <span>Weekly active users</span>
              </div>
              <div className="mini-stat">
                <strong>42,600</strong>
                <span>Trips per day</span>
              </div>
              <div className="mini-stat">
                <strong>24 min</strong>
                <span>Avg. trip · 9.6 km</span>
              </div>
            </div>

            <div className="district-section">
              <div className="district-heading">
                <strong>Usage by district</strong>
                <span>Share of trips</span>
              </div>

              {districtData.map((district) => (
                <div className="district-row" key={district.name}>
                  <span>{district.name}</span>

                  <div className="district-track">
                    <div
                      className="district-fill"
                      style={{ width: `${district.value}%` }}
                    />
                  </div>

                  <span className="district-value">{district.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel impact-panel">
            <div className="panel-title">Impact vs. city goals</div>
            <div className="panel-subtitle">
              Baseline · Current · Target
            </div>

            <ImpactMetricCard
              title="Traffic congestion"
              subtitle="Peak-hour delay vs free flow"
              baseline="42%"
              current="37%"
              target="30%"
              progress={42}
            />

            <ImpactMetricCard
              title="CO₂ / GHG emissions"
              subtitle="Road traffic, tonnes CO₂e per month"
              baseline="4,820 t"
              current="4,415 t"
              target="4,190 t"
              progress={64}
            />

            <ImpactMetricCard
              title="Avg. waiting time at traffic lights"
              subtitle="Minutes per trip"
              baseline="9.8 min"
              current="5.6 min"
              target="4.5 min"
              progress={79}
            />
          </div>
        </section>

        <footer className="dashboard-footer">
          <div className="mobility-score">
            <div className="score-ring">◔</div>
            <div>
              <span>CITY MOBILITY SCORE</span>
              <div>
                <strong>72</strong>
                <span> / 100</span>
              </div>
            </div>
          </div>

          <div className="footer-metric">
            <strong>−12%</strong>
            <span>Congestion reduction</span>
          </div>

          <div className="footer-metric">
            <strong>−8.4%</strong>
            <span>Estimated CO₂ reduction</span>
          </div>

          <div className="footer-metric">
            <strong>4.2 min / trip</strong>
            <span>Average time saved</span>
          </div>

          <div className="footer-metric">
            <strong>64%</strong>
            <span>ESG target completion</span>
            <div className="footer-progress" />
          </div>
        </footer>
      </main>
    </div>
  );
}

export default CityImpactPage;