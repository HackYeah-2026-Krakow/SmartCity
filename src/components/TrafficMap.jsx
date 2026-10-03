import React, { useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  PolylineF,
  CircleF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";

const KRAKOW_CENTER = {
  lat: 50.0647,
  lng: 19.945,
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#89938d" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#d9e8ef" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#e7ece9" }],
    },
  ],
};

const trafficRoutes = [
  {
    id: "route-north",
    path: [
      { lat: 50.084, lng: 19.91 },
      { lat: 50.075, lng: 19.93 },
      { lat: 50.065, lng: 19.945 },
      { lat: 50.055, lng: 19.96 },
    ],
  },
  {
    id: "route-east",
    path: [
      { lat: 50.065, lng: 19.91 },
      { lat: 50.065, lng: 19.93 },
      { lat: 50.0647, lng: 19.945 },
      { lat: 50.065, lng: 19.97 },
      { lat: 50.065, lng: 19.99 },
    ],
  },
  {
    id: "route-south",
    path: [
      { lat: 50.04, lng: 19.945 },
      { lat: 50.05, lng: 19.945 },
      { lat: 50.0647, lng: 19.945 },
      { lat: 50.08, lng: 19.945 },
    ],
  },
  {
    id: "route-diagonal",
    path: [
      { lat: 50.044, lng: 19.89 },
      { lat: 50.052, lng: 19.915 },
      { lat: 50.0647, lng: 19.945 },
      { lat: 50.075, lng: 19.968 },
      { lat: 50.085, lng: 19.985 },
    ],
  },
];

const modeConfig = {
  "traffic-speed": {
    label: "Traffic speed",
    colors: ["#18a866", "#18a866", "#f4bc2b", "#f29a25"],
    stats: ["31 km/h", "41 sec", "12,480 /h", "Moderate"],
  },

  congestion: {
    label: "Congestion",
    colors: ["#18a866", "#f4bc2b", "#f29a25", "#ef6262"],
    stats: ["31 km/h", "41 sec", "12,480 /h", "Moderate"],
  },

  "air-pollution": {
    label: "Air pollution",
    colors: ["#18a866", "#f4bc2b", "#f29a25", "#ef6262"],
    stats: ["29 km/h", "47 sec", "12,820 /h", "High"],
  },

  "signal-delays": {
    label: "Signal delays",
    colors: ["#18a866", "#f4bc2b", "#ef6262", "#ef6262"],
    stats: ["30 km/h", "58 sec", "12,480 /h", "Moderate"],
  },

  "greenpace-efficiency": {
    label: "GreenPace efficiency",
    colors: ["#18a866", "#18a866", "#18a866", "#f4bc2b"],
    stats: ["34 km/h", "32 sec", "11,920 /h", "Low"],
  },
};

function TrafficMap({
  selectedIntersection,
  onSelectIntersection,
}) {
  const mapRef = useRef(null);

  const [activeMode, setActiveMode] = React.useState("congestion");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const intersection = {
    lat: 50.0647,
    lng: 19.945,
  };

  const activeConfig = modeConfig[activeMode];

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const zoomIn = () => {
    if (!mapRef.current) return;

    const currentZoom = mapRef.current.getZoom() || 13;
    mapRef.current.setZoom(currentZoom + 1);
  };

  const zoomOut = () => {
    if (!mapRef.current) return;

    const currentZoom = mapRef.current.getZoom() || 13;
    mapRef.current.setZoom(currentZoom - 1);
  };

  if (loadError) {
    return (
      <div className="map-error">
        <strong>Google Maps could not be loaded.</strong>
        <span>
          Please check VITE_GOOGLE_MAPS_API_KEY in your .env file.
        </span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="map-loading-spinner" />
        <span>Loading Kraków traffic map...</span>
      </div>
    );
  }

  return (
    <div className="traffic-map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={KRAKOW_CENTER}
        zoom={13}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {trafficRoutes.map((route, index) => (
          <PolylineF
            key={route.id}
            path={route.path}
            options={{
              strokeColor:
                activeConfig.colors[index] || "#18a866",
              strokeOpacity: 0.95,
              strokeWeight: index === 3 ? 5 : 4,
            }}
          />
        ))}

        <CircleF
          center={intersection}
          radius={480}
          options={{
            fillColor: "#ef6262",
            fillOpacity: activeMode === "congestion" ? 0.13 : 0.08,
            strokeColor: "#ef6262",
            strokeOpacity: 0.2,
            strokeWeight: 1,
          }}
        />

        <MarkerF
          position={intersection}
          onClick={() =>
            onSelectIntersection?.(intersection)
          }
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ffffff",
            fillOpacity: 1,
            strokeColor: "#ef6262",
            strokeWeight: 5,
          }}
        />

        <MarkerF
          position={{
            lat: 50.065,
            lng: 19.962,
          }}
          label={{
            text: "A12 · 58 sec",
            color: "#30352f",
            fontSize: "12px",
            fontWeight: "600",
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#f29a25",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />

        <MarkerF
          position={{
            lat: 50.065,
            lng: 19.925,
          }}
          label={{
            text: "C03 · 34 sec",
            color: "#30352f",
            fontSize: "12px",
            fontWeight: "600",
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#f4bc2b",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />

        {selectedIntersection && (
          <InfoWindowF
            position={intersection}
            onCloseClick={() =>
              onSelectIntersection?.(null)
            }
          >
            <div className="map-info-window">
              <strong>Intersection #A17</strong>
              <span>Critical congestion</span>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>

      <div className="map-top-tabs">
        {Object.entries(modeConfig).map(([id, config]) => (
          <button
            key={id}
            type="button"
            className={activeMode === id ? "active" : ""}
            onClick={() => setActiveMode(id)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div className="map-zoom-controls">
        <button type="button" onClick={zoomIn}>
          +
        </button>

        <button type="button" onClick={zoomOut}>
          −
        </button>
      </div>

      <div className="map-legend">
        <span className="map-legend-title">
          {activeConfig.label.toUpperCase()}
        </span>

        <div>
          <i className="legend-line good" />
          Good flow
        </div>

        <div>
          <i className="legend-line slowdown" />
          Slowdown
        </div>

        <div>
          <i className="legend-line congestion" />
          Congestion
        </div>

        <div>
          <i className="legend-line critical" />
          Critical hotspot
        </div>
      </div>

      <div className="map-bottom-stats">
        <div>
          <strong>{activeConfig.stats[0]}</strong>
          <span>Avg. speed</span>
        </div>

        <div>
          <strong>{activeConfig.stats[1]}</strong>
          <span>Avg. delay</span>
        </div>

        <div>
          <strong>{activeConfig.stats[2]}</strong>
          <span>Traffic volume</span>
        </div>

        <div>
          <strong>{activeConfig.stats[3]}</strong>
          <span>Pollution level</span>
        </div>
      </div>
    </div>
  );
}

export default TrafficMap;