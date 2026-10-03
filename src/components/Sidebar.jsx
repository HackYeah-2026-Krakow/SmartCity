import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCity,
  faTrafficLight,
  faStar,
  faFileLines,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

import logoBlack from "../assets/logo-black.svg";

const navigationItems = [
  {
    id: "city-impact",
    label: "City Impact",
    icon: faCity,
  },
  {
    id: "live-traffic",
    label: "Live Traffic",
    icon: faTrafficLight,
  },
  {
    id: "rewards-programme",
    label: "Rewards programme",
    icon: faStar,
  },
  {
    id: "reports",
    label: "Reports",
    icon: faFileLines,
  },
  {
    id: "settings",
    label: "Settings",
    icon: faSliders,
  },
];

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside
      className="
        flex min-h-screen w-[198px] min-w-[198px]
        flex-col border-r border-[#eef0ee]
        bg-white px-[10px] pt-[22px] pb-[14px]

        max-[900px]:w-[70px]
        max-[900px]:min-w-[70px]
      "
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-[5px] pb-[22px]">
        <div className="relative h-[50px] w-[50px] shrink-0">
          <img
            src={logoBlack}
            alt="GreenPace IQ"
            className="h-full w-full object-contain"
          />
        </div>

        <span
          className="
            whitespace-nowrap text-[14px] font-extrabold text-[#299548]
            max-[900px]:hidden
          "
        >
          GreenPace IQ
        </span>
      </div>

      {/* Section label */}
      <div
        className="
          mb-2 px-[7px]
          text-[8px] font-bold tracking-[1.3px] text-[#717a74]
          max-[900px]:hidden
        "
      >
        CITY CONSOLE
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-[2px]">
        {navigationItems.map((item) => {
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`
                flex cursor-pointer items-center gap-[10px]
                rounded-[8px] border-0
                px-[10px] py-[10px]
                text-left text-[14px]
                transition-colors

                max-[900px]:justify-center

                ${
                  active
                    ? "bg-[#101411] text-white"
                    : "bg-transparent text-[#505954] hover:bg-[#f2f5f3]"
                }
              `}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className="w-[15px] shrink-0 text-center text-[15px]"
              />

              <span className="max-[900px]:hidden">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div
        className="
          mt-auto flex items-center gap-2
          rounded-[9px] bg-[#f5f7f5]
          px-2 py-[9px]
        "
      >
        <div
          className="
            grid h-[22px] w-[22px] shrink-0
            place-items-center rounded-full
            bg-[#0b1110] text-[7px] font-extrabold text-[#31ea91]
          "
        >
          MO
        </div>

        <div className="max-[900px]:hidden">
          <strong className="block text-[8px]">
            Mobility Office
          </strong>

          <span className="mt-[2px] block text-[7px] text-[#8a928c]">
            City administrator
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;