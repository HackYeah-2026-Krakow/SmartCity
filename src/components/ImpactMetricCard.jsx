import React from "react";

function ImpactMetricCard({
  title,
  subtitle,
  baseline,
  current,
  target,
  progress,
  unit = "",
  badge,
  changePct,
}) {
  const safeProgress = Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));
  const increased = Number.isFinite(changePct) && changePct > 0;

  return (
    <div className="mt-2 rounded-[10px] bg-[#f3f5f4] p-[10px]">
      {/* Header */}
      <div className="flex justify-between gap-[5px]">
        <div>
          <h3 className="m-0 text-[14px] text-left">
            {title}
          </h3>

          <span className="mt-[2px] block text-[12px] text-[#7b847e] text-left">
            {subtitle}
          </span>
        </div>

        {badge && <div
          className="
            h-fit
            rounded-[5px]
            bg-[#dcf7e9]
            px-[5px]
            py-[3px]
            text-[12px]
            font-bold
            text-[#07824a]
          "
        >
          <span className={increased ? "text-[#b42318]" : ""}>{badge}</span>
        </div>}
      </div>

      {/* Values */}
      <div className="mt-[9px] grid grid-cols-3">
        <div>
          <span className="block text-[12px] text-[#858d87]">
            BASELINE
          </span>

          <strong className="mt-[2px] block text-[14px]">
            {baseline}
            {unit && ` ${unit}`}
          </strong>
        </div>

        <div>
          <span className="block text-[12px] text-[#858d87]">
            CURRENT
          </span>

          <strong className="mt-[2px] block text-[14px]">
            {current}
            {unit}
          </strong>
        </div>

        <div>
          <span className="block text-[12px] text-[#858d87]">
            TARGET
          </span>

          <strong className="mt-[2px] block text-[14px]">
            {target}
            {unit}
          </strong>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-2 h-[4px] overflow-hidden rounded-full bg-[#dce2df]">
        <div
          className="h-full rounded-full bg-[#2be78a]"
          style={{ width: `${safeProgress}%` }}
        />
      </div>

      <div className="mt-1 text-[12px] text-[#7e8781]">
        {safeProgress}% of the way to target
      </div>
    </div>
  );
}

export default ImpactMetricCard;