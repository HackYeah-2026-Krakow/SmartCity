// All dashboard data lives here. Swap these objects for an API call later
// (e.g. fetch(`/api/city-impact?range=${range}`)) without touching the UI.

const DAY = 86400000;
const fmtDay = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

// deterministic pseudo-noise so charts look organic but never change between renders
const noise = (i, seed) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function series(labels, start, end, { seed = 1, wobble = 0.03 } = {}) {
  const n = labels.length;
  return labels.map((label, i) => {
    const t = n === 1 ? 1 : i / (n - 1);
    const base = start + (end - start) * t;
    const v = i === n - 1 ? end : base * (1 + (noise(i, seed) - 0.5) * 2 * wobble);
    return { label, value: Math.round(v) };
  });
}

const lastDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * DAY);
    return n <= 7 ? d.toLocaleDateString('en-GB', { weekday: 'short' }) : fmtDay(d);
  });

const lastWeeks = (n) =>
  Array.from({ length: n }, (_, i) => fmtDay(new Date(Date.now() - (n - 1 - i) * 7 * DAY)));

const lastMonths = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (n - 1 - i));
    return d.toLocaleDateString('en-GB', { month: 'short' });
  });

// monthly active users, last 12 months (matches your current chart)
const MAU = [3500, 5000, 6600, 8500, 10200, 10700, 12500, 13800, 15300, 15700, 17500, 18420];
const monthlyLabels = lastMonths(12);

export const RANGES = [
  { id: '7d', label: '7 days', long: 'Last 7 days', compare: 'vs previous 7 days' },
  { id: '30d', label: '30 days', long: 'Last 30 days', compare: 'vs previous 30 days' },
  { id: '12m', label: '12 months', long: 'Last 12 months', compare: 'vs previous 12 months' },
];

export const GRANULARITIES = [
  { id: 'daily', label: 'Daily', metric: 'Daily active users' },
  { id: 'weekly', label: 'Weekly', metric: 'Weekly active users' },
  { id: 'monthly', label: 'Monthly', metric: 'Monthly active users' },
];

export const DATA = {
  '7d': {
    kpis: {
      activeUsers: { value: 11940, delta: 3.2, unit: '%' },
      totalUsers: { value: 46900, delta: 1.8, unit: '%' },
      trips: { value: 298000, delta: 4.6, unit: '%' },
      avgUsage: { value: 25, delta: 2.1, unit: '%' },
      driverShare: { value: 14.0, delta: 0.4, unit: 'pp' },
    },
    adoption: {
      defaultView: 'daily',
      daily: series(lastDays(7), 5700, 6310, { seed: 3, wobble: 0.04 }),
    },
    tiles: { dau: 6310, wau: 12870, tripsPerDay: 42950, avgTripMin: 24, avgTripKm: 9.6 },
    districts: [
      { name: 'Center', share: 35 }, { name: 'North', share: 21 }, { name: 'East', share: 18 },
      { name: 'South', share: 15 }, { name: 'West', share: 11 },
    ],
    goals: {
      congestion: { baseline: 42, current: 36, target: 30 },
      co2: { baseline: 4820, current: 4380, target: 4190 },
      wait: { baseline: 9.8, current: 5.4, target: 4.5 },
    },
    cityScore: 73,
  },

  '30d': {
    kpis: {
      activeUsers: { value: 18420, delta: 12.4, unit: '%' },
      totalUsers: { value: 46900, delta: 8.1, unit: '%' },
      trips: { value: 1280000, delta: 15.3, unit: '%' },
      avgUsage: { value: 26, delta: 6.5, unit: '%' },
      driverShare: { value: 14.2, delta: 1.6, unit: 'pp' },
    },
    adoption: {
      defaultView: 'daily',
      daily: series(lastDays(30), 5100, 6240, { seed: 5, wobble: 0.04 }),
      weekly: series(['W1', 'W2', 'W3', 'W4'], 11400, 12870, { seed: 7, wobble: 0.01 }),
    },
    tiles: { dau: 6240, wau: 12870, tripsPerDay: 42600, avgTripMin: 24, avgTripKm: 9.6 },
    districts: [
      { name: 'Center', share: 34 }, { name: 'North', share: 22 }, { name: 'East', share: 18 },
      { name: 'South', share: 15 }, { name: 'West', share: 11 },
    ],
    goals: {
      congestion: { baseline: 42, current: 37, target: 30 },
      co2: { baseline: 4820, current: 4415, target: 4190 },
      wait: { baseline: 9.8, current: 5.6, target: 4.5 },
    },
    cityScore: 72,
  },

  '12m': {
    kpis: {
      activeUsers: { value: 31750, delta: 86.5, unit: '%' },
      totalUsers: { value: 46900, delta: 96.3, unit: '%' },
      trips: { value: 11600000, delta: 142.0, unit: '%' },
      avgUsage: { value: 21, delta: 18.4, unit: '%' },
      driverShare: { value: 14.2, delta: 9.1, unit: 'pp' },
    },
    adoption: {
      defaultView: 'monthly',
      weekly: series(lastWeeks(52), 2400, 12870, { seed: 11, wobble: 0.04 }),
      monthly: MAU.map((value, i) => ({ label: monthlyLabels[i], value })),
    },
    tiles: { dau: 5480, wau: 12870, tripsPerDay: 38100, avgTripMin: 25, avgTripKm: 9.8 },
    districts: [
      { name: 'Center', share: 38 }, { name: 'North', share: 21 }, { name: 'East', share: 16 },
      { name: 'South', share: 14 }, { name: 'West', share: 11 },
    ],
    goals: {
      congestion: { baseline: 42, current: 39, target: 30 },
      co2: { baseline: 4820, current: 4560, target: 4190 },
      wait: { baseline: 9.8, current: 7.1, target: 4.5 },
    },
    cityScore: 66,
  },
};

export const GOAL_META = {
  congestion: { title: 'Traffic congestion', subtitle: 'Peak-hour delay vs free flow', unit: '%', decimals: 0, noun: 'improvement' },
  co2: { title: 'CO₂ / GHG emissions', subtitle: 'Road traffic, tonnes CO₂e per month', unit: ' t', decimals: 0, noun: 'reduction', thousands: true },
  wait: { title: 'Avg. waiting time at traffic lights', subtitle: 'Minutes per trip', unit: ' min', decimals: 1, noun: 'reduction' },
};

export const DISTRICT_NAMES = ['Center', 'North', 'East', 'South', 'West'];