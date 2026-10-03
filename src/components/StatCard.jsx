import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

function StatCard({ label, value, change, suffix }) {
  return (
    <div
      className="
        min-h-[68px]
        rounded-[10px]
        border border-[#edf0ed]
        bg-white
        p-[10px]
      "
    >
      <div
        className="
          text-[8px]
          uppercase
          tracking-[0.5px]
          text-[#78807a]
        "
      >
        {label}
      </div>

      <div className="mt-1 text-[26px] font-bold leading-none">
        {value}

        {suffix && (
          <span className="ml-[2px] text-[12px]">
            {suffix}
          </span>
        )}
      </div>

      {change && (
        <div
          className="
            mt-2
            inline-flex
            gap-[2px]
            rounded-[5px]
            bg-[#dcf7e9]
            px-[5px]
            py-[2px]
            text-[12px]
            font-bold
            text-[#14844a]
            items-center
          "
        >
          <FontAwesomeIcon
            icon={faArrowUp}
            className="w-[12px] shrink-0 text-center text-[12px]"
          />
          {change}
        </div>
      )}
    </div>
  );
}

export default StatCard;