# GreenPace

GreenPace is a smart-city mobility platform developed during HackYeah 2026 in Kraków.

It is designed to help cities understand **where traffic problems occur, how severe they are, and what impact they have on mobility, fuel consumption and emissions**.

Instead of relying only on expensive fixed infrastructure, GreenPace is designed around the idea of collecting anonymized mobility information from participating drivers and transforming it into actionable city-level traffic intelligence.

This repository contains the **city-facing GreenPace web dashboard**.

---

# The Problem

Cities already collect large amounts of traffic-related information, but the data is often fragmented between different systems, sensors and departments.

This makes it difficult to continuously answer questions such as:

- Where are vehicles losing the most time?
- Which intersections generate the largest queues?
- Where is stop-and-go traffic most severe?
- Which roads experience unusually low average speeds?
- Where are signal delays causing unnecessary waiting?
- Which areas may generate excessive fuel consumption and emissions?
- How effective are mobility improvements over time?

Traditional traffic monitoring infrastructure can also be expensive to deploy at high spatial resolution.

GreenPace explores a complementary approach based on **crowdsourced mobility telemetry and city-level analytics**.

---

# The GreenPace Concept

GreenPace consists conceptually of two sides:

### Driver side

Participating drivers can provide anonymized mobility information such as:

- position,
- speed,
- stopping time,
- acceleration and movement patterns,
- trip duration,
- estimated fuel consumption.

Drivers can receive incentives for contributing data.

### City side

The collected information can be aggregated into a city dashboard showing:

- traffic speed,
- congestion,
- inefficient intersections,
- signal delays,
- traffic-related pollution indicators,
- estimated fuel waste,
- estimated emissions,
- mobility trends,
- effectiveness of traffic improvements.

This repository implements the **city dashboard prototype**.

---

# Business Value

GreenPace is intended to act as an additional traffic-intelligence layer rather than replace existing traffic-management infrastructure.

For a city, the platform could provide:

**Continuous visibility**

Traffic behaviour can be analysed continuously instead of relying only on occasional traffic studies.

**Greater spatial coverage**

Crowdsourced mobility information can potentially provide visibility between fixed sensors and monitoring stations.

**Intersection-level analytics**

The system can identify locations where queues, delays and inefficient traffic flow repeatedly occur.

**Lower cost of additional observations**

Participating vehicles effectively become distributed mobility sensors.

**Evidence-based decisions**

Cities can compare traffic conditions before and after changes to signal timing, road organisation or other mobility policies.

**Sustainability insights**

Traffic behaviour can be translated into indicators related to fuel consumption, idling and estimated emissions.

---

# Potential Customers

GreenPace is primarily designed as a **B2G smart-city platform**.

Potential users include:

- municipal road authorities,
- city mobility departments,
- traffic management centres,
- public transport and infrastructure planners,
- environmental departments,
- smart-city programmes,
- urban analytics teams.

A possible commercial model would be a city subscription or licence based on population, monitored area, number of participating vehicles or required analytics capabilities.

For the HackYeah prototype, no production commercial infrastructure is implemented.

---

# Current Prototype

The current application demonstrates two main dashboard views.

## Live Traffic Intelligence

Interactive traffic visualisation for central Kraków.

The OpenStreetMap-based map contains multiple simulated analytical layers:

- **Traffic speed**
- **Congestion**
- **Air pollution**
- **Signal delays**
- **Green efficiency**

The prototype uses deterministic mocked traffic values for important roads and intersections in central Kraków.

The visualisation uses:

- OpenStreetMap,
- Leaflet,
- React Leaflet,
- Leaflet Heat.

No Google Maps API key is required.

Users can switch between analytical layers and inspect individual intersections.

The map also contains summary traffic indicators and a traffic-assistant panel intended to demonstrate how city operators could interpret the detected problems.

## City Impact Dashboard

The impact dashboard provides a higher-level view of the GreenPace programme.

It currently demonstrates metrics such as:

- active users,
- total users,
- analysed trips,
- average usage,
- share of participating drivers,
- usage by district,
- congestion reduction,
- estimated CO₂ reduction,
- average waiting time,
- mobility programme progress.

The values currently shown are mocked for demonstration purposes.

---

# Technology Stack

GreenPace City Dashboard is a web application built with:

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- Leaflet
- React Leaflet
- Leaflet Heat
- OpenStreetMap
- Font Awesome

The application currently runs entirely on the frontend and does not require a production backend.

---

# Quick Start

## Requirements

Install:

- **Git**
- **Node.js 20.19+**
- **npm**

Node.js 22 LTS can also be used.

Verify your environment:

```bash
node --version
npm --version
git --version
```

---

## Linux

Clone the repository:

```bash
git clone https://github.com/HackYeah-2026-Krakow/SmartCity.git
cd SmartCity
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display an address similar to:

```text
http://localhost:5173
```

Open it in your browser.

### Linux — corporate proxy issues

If npm attempts to use an unavailable HTTP proxy:

```bash
unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY all_proxy ALL_PROXY
npm install
npm run dev
```

---

## macOS

Install Node.js and Git with Homebrew if required:

```bash
brew install node git
```

Clone the repository:

```bash
git clone https://github.com/HackYeah-2026-Krakow/SmartCity.git
cd SmartCity
```

Install dependencies:

```bash
npm install
```

Start GreenPace:

```bash
npm run dev
```

Then open the address printed by Vite, normally:

```text
http://localhost:5173
```

---

## Windows

Install:

- Git for Windows
- Node.js

Then open **PowerShell**.

Clone the repository:

```powershell
git clone https://github.com/HackYeah-2026-Krakow/SmartCity.git
cd SmartCity
```

Install dependencies:

```powershell
npm install
```

Start the application:

```powershell
npm run dev
```

Open the address displayed by Vite, normally:

```text
http://localhost:5173
```

---

# Development Commands

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

---

# Project Structure

`node_modules` and generated/local files are omitted below.

```text
SmartCity/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── main.js
    │
    ├── assets/
    │   ├── hero.png
    │   ├── logo-black.svg
    │   ├── logo-ss.png
    │   ├── logo.svg
    │   ├── react.svg
    │   └── vite.svg
    │
    ├── components/
    │   ├── ImpactMetricCard.jsx
    │   ├── Sidebar.jsx
    │   ├── StatCard.jsx
    │   ├── TrafficAssistant.jsx
    │   └── TrafficMap.jsx
    │
    └── page/
        ├── CityImpactPage.jsx
        └── LiveTrafficPage.jsx
```

---

# Map Architecture

The map implementation is separated from the dashboard page.

```text
LiveTrafficPage.jsx
        │
        ├── TrafficMap.jsx
        │      ├── OpenStreetMap tiles
        │      ├── heatmap layers
        │      ├── intersections
        │      └── mocked Kraków traffic data
        │
        └── TrafficAssistant.jsx
```

This separation allows the mocked traffic dataset to later be replaced by data received from an API without redesigning the complete dashboard.

---

# Traffic Layers

The prototype models several types of traffic information differently.

### Traffic Speed

Represents estimated vehicle speeds along important traffic corridors.

Slow-moving roads appear as problematic areas while roads with smoother traffic appear more efficient.

### Congestion

Represents the relative severity of traffic queues.

Congestion hotspots are concentrated around important junctions and extend along approaching roads.

### Air Pollution

Represents a simulated traffic-related pollution layer.

The current prototype uses wider heatmap areas because air pollution does not remain limited to an individual road segment.

### Signal Delays

Represents estimated time lost at traffic-controlled intersections.

The strongest values are concentrated around major intersections.

### Green Efficiency

Represents how efficiently traffic moves through an area.

Steady traffic receives a higher efficiency value while repeated stopping, low speeds and congestion reduce the score.

---

# Mock Data

The current HackYeah version does **not** claim to display live traffic measurements.

Traffic conditions are deliberately mocked to demonstrate the GreenPace concept.

The values are designed to resemble plausible weekday traffic conditions in central Kraków and include locations such as:

- Aleje Trzech Wieszczów,
- Rondo Mogilskie,
- Rondo Grzegórzeckie,
- Rondo Grunwaldzkie,
- Dietla / Starowiślna,
- Lubicz / Mogilska,
- Powstania Warszawskiego.

In a production implementation, the mocked dataset would be replaced by aggregated telemetry received from participating vehicles and potentially other municipal data sources.

---

# Proposed Production Architecture

A future production version could follow the following flow:

```text
Participating vehicles
        │
        │ anonymized mobility telemetry
        ▼
Data ingestion API
        │
        ▼
Stream / batch processing
        │
        ├── speed aggregation
        ├── congestion detection
        ├── queue detection
        ├── intersection analysis
        ├── fuel estimation
        └── emissions estimation
        │
        ▼
Spatial database
        │
        ▼
GreenPace Analytics API
        │
        ▼
City Dashboard
```

The current repository implements only the frontend dashboard and mocked analytical layer.

---

# Data Privacy Concept

A production GreenPace deployment should avoid storing unnecessary personally identifiable information.

The intended model is based on aggregated mobility telemetry.

Relevant privacy mechanisms could include:

- pseudonymous vehicle identifiers,
- aggregation before city-level visualisation,
- limited retention of raw location data,
- configurable consent,
- minimum reporting thresholds,
- separation between user identity and mobility telemetry.

These controls are architectural goals and are **not yet implemented in the HackYeah prototype**.

---

# Prototype Status

GreenPace is currently a **HackYeah 2026 proof-of-concept**.

The application demonstrates:

```text
Mobility data
      ↓
Traffic analytics
      ↓
Spatial visualisation
      ↓
Problem detection
      ↓
City decision support
      ↓
Impact measurement
```

The prototype focuses on demonstrating the product concept and user experience rather than providing production-grade traffic measurements.

---

# Future Development

Possible next steps include:

- backend API for mobility telemetry,
- live vehicle-data ingestion from android cat, 
- PostGIS spatial database,
- real-time traffic aggregation,
- historical traffic comparison,
- anomaly detection,
- automated bottleneck detection,
- queue-length estimation,
- traffic-signal optimisation analysis,
- real emissions modelling,
- authentication and city accounts,
- configurable reporting,
- integration with municipal traffic systems,
- connection with the GreenPace driver application.

---

# HackYeah 2026

GreenPace was created as a smart-city prototype during **HackYeah 2026 in Kraków**.

The project explores how crowdsourced mobility data can help transform individual vehicle journeys into useful city-level intelligence.