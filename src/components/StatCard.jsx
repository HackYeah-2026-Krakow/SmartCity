import React from "react";

function StatCard({ label, value, change, suffix }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>

      <div className="stat-card-value">
        {value}
        {suffix && <span>{suffix}</span>}
      </div>

      {change && (
        <div className="stat-card-change">
          <span>↑</span>
          {change}
        </div>
      )}
    </div>
  );
}

export default StatCard;