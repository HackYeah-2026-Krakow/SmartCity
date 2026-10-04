export default function KpiCard({ label, value, suffix, delta }) {
  return (
    <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-500">{label}</p>
      <p className="mt-3 text-4xl font-bold text-gray-900">
        {value}
        {suffix && <span className="ml-1 text-lg font-semibold">{suffix}</span>}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
        ↑ +{delta}
      </span>
    </div>
  );
}