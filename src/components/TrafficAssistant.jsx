import React, { useState } from "react";

const suggestedActions = [
  "Increase green phase by 12 sec",
  "Reduce speed limit from 50 → 40 km/h",
  "Change lane assignment",
  "Add adaptive signal timing",
  "Test alternative traffic routing",
];

function TrafficAssistant() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [simulation, setSimulation] = useState(false);

  const handleSimulate = () => {
    setSimulation(true);
  };

  return (
    <aside className="traffic-assistant">
      <div className="assistant-heading">
        <div className="assistant-icon">✦</div>

        <div>
          <h2>AI Traffic Assistant</h2>
          <span>Analysing Intersection #A17</span>
        </div>
      </div>

      <div className="problem-card">
        <span>PROBLEM DETECTED</span>
        <strong>
          Recurring congestion between 16:00–18:30
        </strong>
      </div>

      <div className="assistant-section">
        <div className="assistant-section-title">
          LIKELY CAUSE
        </div>

        <ul>
          <li>Traffic volume too high</li>
          <li>Signal cycle mismatch</li>
          <li>Lane capacity bottleneck</li>
        </ul>
      </div>

      <div className="assistant-section">
        <div className="assistant-section-title">
          SUGGESTED ACTIONS
        </div>

        <div className="suggested-actions">
          {suggestedActions.map((action, index) => (
            <button
              type="button"
              key={action}
              className={
                selectedAction === action ? "selected" : ""
              }
              onClick={() => setSelectedAction(action)}
            >
              <span>{index + 1}</span>
              {action}
            </button>
          ))}
        </div>
      </div>

      {selectedAction && (
        <div className="selected-action">
          <span>SELECTED ACTION</span>
          <strong>{selectedAction}</strong>
        </div>
      )}

      <div className="assistant-section predicted-impact-section">
        <div className="assistant-section-title">
          {simulation
            ? "SIMULATED IMPACT"
            : "PREDICTED IMPACT"}
        </div>

        <div className="predicted-impact-grid">
          <div>
            <strong>{simulation ? "−24%" : "−18%"}</strong>
            <span>Congestion</span>
          </div>

          <div>
            <strong>{simulation ? "−31 sec" : "−22 sec"}</strong>
            <span>Average delay</span>
          </div>

          <div>
            <strong>{simulation ? "−10%" : "−7%"}</strong>
            <span>CO₂</span>
          </div>

          <div>
            <strong>{simulation ? "+8 km/h" : "+6 km/h"}</strong>
            <span>Average speed</span>
          </div>
        </div>
      </div>

      <button
        className="simulate-button"
        type="button"
        onClick={handleSimulate}
        disabled={!selectedAction}
      >
        <span>▶</span>

        {simulation
          ? "Simulation complete"
          : selectedAction
            ? "Simulate change"
            : "Select an action first"}
      </button>
    </aside>
  );
}

export default TrafficAssistant;