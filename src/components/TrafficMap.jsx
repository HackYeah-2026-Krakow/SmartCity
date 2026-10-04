import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat";


const KRAKOW_CENTER = [50.0617, 19.9430];


const layerConfig = {
  trafficSpeed: {
    label: "Traffic speed",

    radius: 28,
    blur: 22,

    gradient: {
      0.0: "#ef4444",
      0.32: "#f97316",
      0.58: "#facc15",
      0.78: "#84cc16",
      1.0: "#16a34a",
    },

    legend: [
      {
        label: "< 15 km/h",
        color: "#ef4444",
      },
      {
        label: "15–22 km/h",
        color: "#f97316",
      },
      {
        label: "22–30 km/h",
        color: "#facc15",
      },
      {
        label: "> 30 km/h",
        color: "#16a34a",
      },
    ],
  },

  congestion: {
    label: "Congestion",

    radius: 36,
    blur: 30,

    gradient: {
      0.0: "#22c55e",
      0.35: "#facc15",
      0.62: "#f97316",
      0.82: "#ef4444",
      1.0: "#991b1b",
    },

    legend: [
      {
        label: "Free flow",
        color: "#22c55e",
      },
      {
        label: "Moderate",
        color: "#facc15",
      },
      {
        label: "Heavy",
        color: "#f97316",
      },
      {
        label: "Critical",
        color: "#ef4444",
      },
    ],
  },

  airPollution: {
    label: "Air pollution",

    radius: 50,
    blur: 38,

    gradient: {
      0.0: "#22c55e",
      0.30: "#84cc16",
      0.50: "#facc15",
      0.72: "#f97316",
      1.0: "#dc2626",
    },

    legend: [
      {
        label: "< 25 µg/m³ NO₂",
        color: "#22c55e",
      },
      {
        label: "25–35 µg/m³",
        color: "#facc15",
      },
      {
        label: "35–45 µg/m³",
        color: "#f97316",
      },
      {
        label: "> 45 µg/m³",
        color: "#dc2626",
      },
    ],
  },

  signalDelays: {
    label: "Signal delays",

    radius: 24,
    blur: 18,

    gradient: {
      0.0: "#22c55e",
      0.36: "#facc15",
      0.62: "#f97316",
      0.82: "#ef4444",
      1.0: "#991b1b",
    },

    legend: [
      {
        label: "< 30 sec",
        color: "#22c55e",
      },
      {
        label: "30–60 sec",
        color: "#facc15",
      },
      {
        label: "60–90 sec",
        color: "#f97316",
      },
      {
        label: "> 90 sec",
        color: "#ef4444",
      },
    ],
  },

  greenEfficiency: {
    label: "Green efficiency",

    radius: 32,
    blur: 25,

    gradient: {
      0.0: "#dc2626",
      0.30: "#f97316",
      0.52: "#facc15",
      0.72: "#84cc16",
      1.0: "#16a34a",
    },

    legend: [
      {
        label: "Poor",
        color: "#dc2626",
      },
      {
        label: "Low",
        color: "#f97316",
      },
      {
        label: "Medium",
        color: "#facc15",
      },
      {
        label: "Efficient",
        color: "#16a34a",
      },
    ],
  },
};


function interpolateSegment(
  start,
  end,
  numberOfPoints = 8
) {
  const result = [];

  for (let i = 0; i <= numberOfPoints; i += 1) {
    const ratio = i / numberOfPoints;

    const lat =
      start[0] +
      (end[0] - start[0]) * ratio;

    const lng =
      start[1] +
      (end[1] - start[1]) * ratio;

    result.push([lat, lng]);
  }

  return result;
}


function sampleCorridor(path) {
  if (!path || path.length < 2) {
    return [];
  }

  const points = [];

  for (let i = 0; i < path.length - 1; i += 1) {
    points.push(
      ...interpolateSegment(
        path[i],
        path[i + 1],
        9
      )
    );
  }

  return points;
}


function HeatLayer({
  data,
  activeLayer,
}) {
  const map = useMap();

  const points = useMemo(() => {
    const result = [];

    data.corridors.forEach((corridor) => {
      const value =
        corridor.heat[activeLayer];

      const corridorPoints =
        sampleCorridor(corridor.path);

      corridorPoints.forEach(
        ([lat, lng]) => {
          /*
           * Never use absolute zero.
           * This keeps low-intensity areas visible
           * while preserving the relative differences.
           */
          const intensity = Math.max(
            0.16,
            value
          );

          result.push([
            lat,
            lng,
            intensity,
          ]);
        }
      );
    });

    data.intersections.forEach(
      (intersection) => {
        const value =
          intersection.heat[activeLayer];

        const intensity = Math.max(
          0.18,
          value
        );

        /*
         * Add several nearby points.
         * This creates a natural concentrated hotspot
         * around intersections rather than a single dot.
         */
        const [lat, lng] =
          intersection.position;

        result.push(
          [lat, lng, intensity],
          [
            lat + 0.00025,
            lng,
            intensity * 0.92,
          ],
          [
            lat - 0.00025,
            lng,
            intensity * 0.92,
          ],
          [
            lat,
            lng + 0.00035,
            intensity * 0.92,
          ],
          [
            lat,
            lng - 0.00035,
            intensity * 0.92,
          ]
        );
      }
    );

    return result;
  }, [
    data,
    activeLayer,
  ]);


  useEffect(() => {
    const config =
      layerConfig[activeLayer];

    const layer = L.heatLayer(
      points,
      {
        radius: config.radius,
        blur: config.blur,

        maxZoom: 17,

        minOpacity: 0.45,

        gradient:
          config.gradient,
      }
    );

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [
    map,
    points,
    activeLayer,
  ]);

  return null;
}


function valueForLayer(
  intersection,
  activeLayer
) {
  const metrics =
    intersection.metrics;

  switch (activeLayer) {
    case "trafficSpeed":
      return `${metrics.speedKmh} km/h`;

    case "congestion":
      return `${metrics.congestionPercent}% congestion`;

    case "airPollution":
      return Number.isFinite(metrics.no2) ? `${metrics.no2} µg/m³ NO₂` : "No air-quality data";

    case "signalDelays":
      return `${metrics.signalDelaySec} sec delay`;

    case "greenEfficiency":
      return `${metrics.efficiencyPercent}% efficiency`;

    default:
      return "";
  }
}


function markerColor(
  value,
  activeLayer
) {
  if (
    activeLayer === "trafficSpeed" ||
    activeLayer === "greenEfficiency"
  ) {
    if (value >= 0.75) {
      return "#16a34a";
    }

    if (value >= 0.5) {
      return "#facc15";
    }

    if (value >= 0.3) {
      return "#f97316";
    }

    return "#ef4444";
  }

  if (value >= 0.82) {
    return "#ef4444";
  }

  if (value >= 0.62) {
    return "#f97316";
  }

  if (value >= 0.35) {
    return "#facc15";
  }

  return "#22c55e";
}


function TrafficMap({
  data,
  isMock = true,
  selectedIntersection,
  onSelectIntersection,
}) {
  const [
    activeLayer,
    setActiveLayer,
  ] = useState("trafficSpeed");

  const config =
    layerConfig[activeLayer];


  const hasAirQuality = [...data.intersections, ...data.corridors].some(item => Number.isFinite(item.metrics.no2));
  const summary = useMemo(() => {
    const mean = field => {
      const values = data.intersections.map(item => item.metrics[field]).filter(Number.isFinite);
      return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    };
    const speed = mean("speedKmh");
    const rounded = field => { const value = mean(field); return value === null ? "No data" : Math.round(value); };
    return {
      averageSpeed: speed === null ? "No data" : speed.toFixed(1),
      averageCongestion: rounded("congestionPercent"),
      averageNO2: rounded("no2"),
      averageDelay: rounded("signalDelaySec"),
    };
  }, [data]);


  return (
    <div
      className="
        relative
        h-full
        min-h-[600px]
        w-full
        overflow-hidden
        rounded-[17px]
        bg-[#dfe6e2]
      "
    >
      <MapContainer
        center={KRAKOW_CENTER}
        zoom={14}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        className="
          absolute
          inset-0
          z-0
          h-full
          min-h-[600px]
          w-full
        "
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl
          position="topright"
        />

        <HeatLayer
          data={data}
          activeLayer={activeLayer}
        />

        {data.intersections.map(
          (intersection) => {
            const value =
              intersection.heat[
                activeLayer
              ];

            const color =
              markerColor(
                value,
                activeLayer
              );

            return (
              <CircleMarker
                key={intersection.id}
                center={
                  intersection.position
                }
                radius={
                  selectedIntersection?.id ===
                  intersection.id
                    ? 9
                    : 6
                }
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: color,
                  fillOpacity: 0.95,
                }}
                eventHandlers={{
                  click: () => {
                    onSelectIntersection?.(
                      intersection
                    );
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <strong className="block text-[13px] text-[#111613]">
                      {
                        intersection.name
                      }
                    </strong>

                    <span
                      className="
                        mt-1
                        block
                        text-[12px]
                        font-semibold
                      "
                      style={{
                        color,
                      }}
                    >
                      {valueForLayer(
                        intersection,
                        activeLayer
                      )}
                    </span>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-[#667069]">
                      <span>
                        Speed
                      </span>

                      <strong>
                        {
                          intersection
                            .metrics
                            .speedKmh
                        }{" "}
                        km/h
                      </strong>

                      <span>
                        Congestion
                      </span>

                      <strong>
                        {
                          intersection
                            .metrics
                            .congestionPercent
                        }
                        %
                      </strong>

                      <span>
                        NO₂
                      </span>

                      <strong>
                        {Number.isFinite(intersection.metrics.no2) ? `${intersection.metrics.no2} µg/m³` : "No data"}
                      </strong>

                      <span>
                        Signal delay
                      </span>

                      <strong>
                        {
                          intersection
                            .metrics
                            .signalDelaySec
                        }{" "}
                        sec
                      </strong>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          }
        )}
      </MapContainer>


      {/* Layer selector */}
      <div
        className="
          absolute
          left-4
          top-4
          z-[500]
          flex
          max-w-[calc(100%-90px)]
          gap-1
          overflow-x-auto
          rounded-[13px]
          bg-white
          p-[5px]
          shadow-lg
        "
      >
        {Object.entries(
          layerConfig
        ).filter(([key]) => key !== "airPollution" || hasAirQuality).map(
          ([
            key,
            layer,
          ]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setActiveLayer(key)
              }
              className={`
                whitespace-nowrap
                rounded-[9px]
                px-[13px]
                py-[10px]
                text-[11px]
                font-medium
                transition

                ${
                  activeLayer ===
                  key
                    ? "bg-[#0c1110] text-white"
                    : "bg-transparent text-[#47504b] hover:bg-[#f2f5f3]"
                }
              `}
            >
              {layer.label}
            </button>
          )
        )}
      </div>


      {/* Scenario indicator */}
      <div
        className="
          absolute
          right-[54px]
          top-[72px]
          z-[500]
          rounded-lg
          bg-black/75
          px-3
          py-2
          text-left
          text-white
          backdrop-blur
        "
      >
        <div className="text-[8px] font-bold uppercase tracking-[1.2px] text-[#8df4bd]">
          {isMock ? "Mock scenario" : "Traffic scenario"}
        </div>

        <div className="mt-[2px] text-[10px]">
          {data.scenario}
        </div>
      </div>


      {/* Legend */}
      <div
        className="
          absolute
          bottom-[18px]
          left-[16px]
          z-[500]
          min-w-[155px]
          rounded-[12px]
          bg-white/95
          p-[13px]
          text-left
          shadow-lg
          backdrop-blur
        "
      >
        <span className="mb-2 block text-[8px] font-bold uppercase tracking-[1px] text-[#6f7972]">
          {config.label}
        </span>

        <div className="flex flex-col gap-[7px]">
          {config.legend.map(
            (item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-[9px] text-[#39413c]"
              >
                <span
                  className="h-[5px] w-[20px] rounded-full"
                  style={{
                    background:
                      item.color,
                  }}
                />

                {item.label}
              </div>
            )
          )}
        </div>
      </div>


      {/* Summary */}
      <div
        className="
          absolute
          bottom-[18px]
          left-1/2
          z-[500]
          grid
          min-w-[500px]
          -translate-x-1/2
          grid-cols-4
          overflow-hidden
          rounded-[13px]
          bg-white/95
          shadow-lg
          backdrop-blur

          max-[800px]:hidden
        "
      >
        <div className="border-r border-[#e8ece9] px-4 py-[10px]">
          <strong className="block text-[15px] text-[#111613]">
            {summary.averageSpeed}
          </strong>

          <span className="text-[8px] text-[#778079]">
            AVG KM/H
          </span>
        </div>

        <div className="border-r border-[#e8ece9] px-4 py-[10px]">
          <strong className="block text-[15px] text-[#111613]">
            {summary.averageCongestion}{typeof summary.averageCongestion === "number" ? "%" : ""}
          </strong>

          <span className="text-[8px] text-[#778079]">
            CONGESTION
          </span>
        </div>

        <div className="border-r border-[#e8ece9] px-4 py-[10px]">
          <strong className="block text-[15px] text-[#111613]">
            {summary.averageNO2}
          </strong>

          <span className="text-[8px] text-[#778079]">
            AVG NO₂ µg/m³
          </span>
        </div>

        <div className="px-4 py-[10px]">
          <strong className="block text-[15px] text-[#111613]">
            {summary.averageDelay}{typeof summary.averageDelay === "number" ? "s" : ""}
          </strong>

          <span className="text-[8px] text-[#778079]">
            SIGNAL DELAY
          </span>
        </div>
      </div>


      {/* Clear prototype label */}
      <div
        className="
          absolute
          bottom-[18px]
          right-[16px]
          z-[500]
          rounded-lg
          bg-[#111613]/90
          px-[9px]
          py-[6px]
          text-[8px]
          font-bold
          tracking-[1px]
          text-white
        "
      >
        {isMock ? "MOCK TRAFFIC DATA" : data.simulated ? "SIMULATED TRAFFIC · API" : "TRAFFIC DATA · API"}
      </div>
    </div>
  );
}


export default TrafficMap;