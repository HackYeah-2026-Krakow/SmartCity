import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TrafficMap from "../components/TrafficMap";
import TrafficAssistant from "../components/TrafficAssistant";

function LiveTrafficPage({ onNavigate }) {
  const [selectedIntersection, setSelectedIntersection] = useState(null);

  return (
    <div className="live-traffic-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .live-traffic-page {
          min-height: 100vh;
          background: #eef2f0;
          color: #151a17;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          display: flex;
        }

        .live-traffic-page .app-sidebar {
          width: 245px;
          min-width: 245px;
          min-height: 100vh;
          background: #ffffff;
          padding: 24px 15px 18px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e6ebe7;
        }

        .live-traffic-page .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 8px 30px;
        }

        .live-traffic-page .brand-name {
          font-size: 17px;
          font-weight: 800;
          color: #329c4d;
        }

        .live-traffic-page .brand-mark {
          position: relative;
          width: 35px;
          height: 35px;
        }

        .live-traffic-page .brand-leaf {
          position: absolute;
          width: 21px;
          height: 10px;
          border-radius: 100% 0 100% 0;
          border: 3px solid #329c4d;
          transform: rotate(-25deg);
        }

        .live-traffic-page .brand-leaf-one {
          left: 0;
          top: 4px;
        }

        .live-traffic-page .brand-leaf-two {
          right: 0;
          top: 12px;
          transform: rotate(35deg);
        }

        .live-traffic-page .brand-wheel {
          position: absolute;
          right: 1px;
          bottom: 0;
          font-size: 13px;
          color: #111613;
        }

        .live-traffic-page .sidebar-label {
          padding: 0 13px;
          color: #68726b;
          font-size: 9px;
          letter-spacing: 1.3px;
          font-weight: 700;
          margin-bottom: 9px;
        }

        .live-traffic-page .sidebar-navigation {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .live-traffic-page .sidebar-navigation-item {
          border: 0;
          background: transparent;
          color: #4e5751;
          display: flex;
          align-items: center;
          gap: 13px;
          border-radius: 10px;
          padding: 12px 12px;
          font-size: 13px;
          text-align: left;
          cursor: pointer;
        }

        .live-traffic-page .sidebar-navigation-item:hover {
          background: #f1f4f2;
        }

        .live-traffic-page .sidebar-navigation-item.active {
          background: #0d1210;
          color: #ffffff;
        }

        .live-traffic-page .sidebar-navigation-icon {
          width: 17px;
          font-size: 18px;
        }

        .live-traffic-page .sidebar-user {
          margin-top: auto;
          background: #f3f6f4;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-traffic-page .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #101512;
          color: #2bea8a;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 800;
        }

        .live-traffic-page .sidebar-user strong {
          display: block;
          font-size: 10px;
        }

        .live-traffic-page .sidebar-user span {
          display: block;
          font-size: 8px;
          color: #7c857f;
          margin-top: 2px;
        }

        .live-traffic-main {
          min-width: 0;
          flex: 1;
          padding: 25px 28px 22px;
          display: flex;
          flex-direction: column;
        }

        .live-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .live-header h1 {
          font-size: 25px;
          margin: 0;
          letter-spacing: -0.7px;
        }

        .live-header p {
          color: #69736c;
          margin: 3px 0 0;
          font-size: 13px;
        }

        .live-status {
          background: #ffffff;
          border: 1px solid #dfe5e1;
          border-radius: 10px;
          padding: 9px 13px;
          display: flex;
          gap: 7px;
          align-items: center;
          color: #667069;
          font-size: 11px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #1bc477;
          border-radius: 50%;
        }

        .live-dashboard {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 352px;
          gap: 15px;
        }

        .traffic-map-wrapper {
          position: relative;
          min-height: 600px;
          border-radius: 17px;
          overflow: hidden;
          background: #dfe6e2;
          border: 1px solid #dde4df;
        }

        .traffic-map {
          width: 100%;
          height: 100%;
          min-height: 600px;
          position: relative;
        }

        .map-top-tabs {
          position: absolute;
          left: 16px;
          top: 16px;
          z-index: 5;
          display: flex;
          background: #ffffff;
          border-radius: 13px;
          box-shadow: 0 7px 20px rgba(0,0,0,.1);
          padding: 5px;
        }

        .map-top-tabs button {
          border: 0;
          background: transparent;
          padding: 10px 13px;
          border-radius: 9px;
          font-size: 11px;
          color: #47504b;
          cursor: pointer;
          white-space: nowrap;
        }

        .map-top-tabs button.active {
          background: #0c1110;
          color: #ffffff;
        }

        .map-zoom-controls {
          position: absolute;
          top: 17px;
          right: 15px;
          z-index: 5;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 6px 16px rgba(0,0,0,.12);
          overflow: hidden;
        }

        .map-zoom-controls button {
          display: block;
          width: 38px;
          height: 38px;
          background: #ffffff;
          border: 0;
          border-bottom: 1px solid #edf0ee;
          font-size: 21px;
          cursor: pointer;
        }

        .map-zoom-controls button:last-child {
          border-bottom: 0;
        }

        .map-legend {
          position: absolute;
          left: 15px;
          bottom: 15px;
          z-index: 5;
          background: rgba(255,255,255,.96);
          border-radius: 12px;
          padding: 12px 14px;
          box-shadow: 0 6px 18px rgba(0,0,0,.1);
          min-width: 135px;
          font-size: 10px;
        }

        .map-legend-title {
          display: block;
          color: #6f7972;
          font-size: 8px;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .map-legend div {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }

        .legend-line {
          width: 17px;
          height: 4px;
          border-radius: 10px;
        }

        .legend-line.good {
          background: #18a866;
        }

        .legend-line.slowdown {
          background: #f4bc2b;
        }

        .legend-line.congestion {
          background: #f29a25;
        }

        .legend-line.critical {
          background: #ef6262;
        }

        .map-bottom-stats {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 15px;
          z-index: 5;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: rgba(255,255,255,.97);
          border-radius: 13px;
          box-shadow: 0 6px 18px rgba(0,0,0,.1);
          min-width: 490px;
          overflow: hidden;
        }

        .map-bottom-stats div {
          padding: 10px 14px;
          border-right: 1px solid #e8ece9;
        }

        .map-bottom-stats div:last-child {
          border-right: 0;
        }

        .map-bottom-stats strong {
          display: block;
          font-size: 15px;
        }

        .map-bottom-stats span {
          display: block;
          color: #778079;
          font-size: 8px;
          margin-top: 2px;
        }

        .map-info-window {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 3px;
        }

        .map-info-window strong {
          font-size: 12px;
        }

        .map-info-window span {
          color: #e24e4e;
          font-size: 10px;
        }

        .map-loading,
        .map-error {
          height: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: #69736c;
          background: #e8ede9;
        }

        .map-loading-spinner {
          width: 25px;
          height: 25px;
          border: 3px solid #cbd5ce;
          border-top-color: #22d981;
          border-radius: 50%;
          animation: traffic-spin .8s linear infinite;
        }

        .map-error strong {
          color: #d04e4e;
        }

        .map-error span {
          font-size: 12px;
        }

        @keyframes traffic-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .traffic-assistant {
          background: #ffffff;
          border: 1px solid #dfe5e1;
          border-radius: 17px;
          padding: 18px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .assistant-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .assistant-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: #0c1110;
          color: #2bea8a;
          display: grid;
          place-items: center;
          font-size: 20px;
        }

        .assistant-heading h2 {
          margin: 0;
          font-size: 15px;
        }

        .assistant-heading span {
          display: block;
          color: #7a847e;
          font-size: 10px;
          margin-top: 3px;
        }

        .problem-card {
          background: #ffeded;
          border-radius: 12px;
          padding: 13px;
          margin-bottom: 15px;
        }

        .problem-card span {
          color: #d84646;
          font-size: 8px;
          letter-spacing: 1px;
          font-weight: 800;
          display: block;
          margin-bottom: 6px;
        }

        .problem-card strong {
          display: block;
          font-size: 13px;
          line-height: 1.25;
        }

        .assistant-section {
          margin-bottom: 13px;
        }

        .assistant-section-title {
          color: #69736c;
          font-size: 8px;
          letter-spacing: 1px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .assistant-section ul {
          padding: 0 0 0 18px;
          margin: 0;
          color: #535d56;
          font-size: 11px;
          line-height: 1.8;
        }

        .suggested-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .suggested-actions button {
          border: 0;
          background: #f2f4f3;
          border-radius: 9px;
          padding: 9px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          color: #242a26;
          text-align: left;
          cursor: pointer;
        }

        .suggested-actions button:hover {
          background: #eaf0ec;
        }

        .suggested-actions button span {
          width: 21px;
          height: 21px;
          min-width: 21px;
          border-radius: 50%;
          background: #111613;
          color: #ffffff;
          display: grid;
          place-items: center;
          font-size: 9px;
          font-weight: 700;
        }

        .predicted-impact-section {
          margin-top: 0;
        }

        .predicted-impact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
        }

        .predicted-impact-grid div {
          background: #daf7e7;
          border-radius: 10px;
          padding: 10px;
        }

        .predicted-impact-grid strong {
          color: #07864a;
          display: block;
          font-size: 19px;
        }

        .predicted-impact-grid span {
          color: #4b6255;
          font-size: 9px;
          margin-top: 2px;
          display: block;
        }

        .simulate-button {
          margin-top: auto;
          border: 0;
          background: #2bea8a;
          color: #06130b;
          border-radius: 10px;
          padding: 13px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .simulate-button:hover {
          background: #20d77c;
        }

        .simulate-button span {
          margin-right: 7px;
        }

        @media (max-width: 1050px) {
          .live-traffic-page .app-sidebar {
            width: 75px;
            min-width: 75px;
          }

          .live-traffic-page .brand-name,
          .live-traffic-page .sidebar-label,
          .live-traffic-page .sidebar-navigation-item span:last-child,
          .live-traffic-page .sidebar-user > div:last-child {
            display: none;
          }

          .live-traffic-page .sidebar-navigation-item {
            justify-content: center;
          }

          .live-dashboard {
            grid-template-columns: 1fr;
          }

          .traffic-assistant {
            min-height: auto;
          }
        }

        @media (max-width: 700px) {
          .live-traffic-main {
            padding: 15px;
          }

          .live-header {
            align-items: flex-start;
            gap: 10px;
          }

          .live-header h1 {
            font-size: 20px;
          }

          .live-status {
            display: none;
          }

          .map-top-tabs {
            right: 15px;
            overflow-x: auto;
          }

          .map-top-tabs button {
            padding: 8px;
          }

          .map-bottom-stats {
            min-width: 0;
            width: calc(100% - 30px);
          }

          .map-bottom-stats div {
            padding: 8px;
          }

          .map-bottom-stats strong {
            font-size: 11px;
          }
        }
      `}</style>

      <Sidebar activePage="live-traffic" onNavigate={onNavigate} />

      <main className="live-traffic-main">
        <header className="live-header">
          <div>
            <h1>Live Traffic Intelligence</h1>
            <p>Where is the problem — and how do we fix it?</p>
          </div>

          <div className="live-status">
            <span className="live-dot" />
            <strong>Live</strong>
            <span>updated 12 s ago</span>
          </div>
        </header>

        <section className="live-dashboard">
          <div className="traffic-map-wrapper">
            <TrafficMap
              selectedIntersection={selectedIntersection}
              onSelectIntersection={setSelectedIntersection}
            />
          </div>

          <TrafficAssistant />
        </section>
      </main>
    </div>
  );
}

export default LiveTrafficPage;