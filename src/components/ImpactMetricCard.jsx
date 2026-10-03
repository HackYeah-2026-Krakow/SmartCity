import React from "react";

function ImpactMetricCard({
  title,
  subtitle,
  baseline,
  current,
  target,
  progress,
  unit = "",
}) {
  return (
    <div className="impact-metric-card">
      <div className="impact-metric-header">
        <div>
          <h3>{title}</h3>
          <span>{subtitle}</span>
        </div>

        <div className="impact-metric-badge">
          {title.includes("Traffic") ? "12% improvement" : "8.4% reduction"}
        </div>
      </div>

      <div className="impact-metric-values">
        <div>
          <span>BASELINE</span>
          <strong>
            {baseline}
            {unit}
          </strong>
        </div>

        <div>
          <span>CURRENT</span>
          <strong>
            {current}
            {unit}
          </strong>
        </div>

        <div>
          <span>TARGET</span>
          <strong>
            {target}
            {unit}
          </strong>
        </div>
      </div>

      <div className="impact-progress">
        <div
          className="impact-progress-value"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="impact-progress-label">
        {progress}% of the way to target
      </div>
    </div>
  );
}

export default ImpactMetricCard;