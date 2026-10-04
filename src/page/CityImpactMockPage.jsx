import React, { useState } from "react";
import StatCard from "../components/StatCard";
import ImpactMetricCard from "../components/ImpactMetricCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const districtData = [
  { name: "Center", value: 34 },
  { name: "North", value: 22 },
  { name: "East", value: 18 },
  { name: "South", value: 15 },
  { name: "West", value: 11 },
];

import {
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

function CityImpactMockPage() {
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="flex min-h-screen  bg-[#f5f6f5] font-sans text-[#151a17]">

      <main
        className="
          min-w-0
          flex-1
          bg-[#edf1ef]
          px-[18px]
          py-[14px]
        "
      >
        {/* Header */}
        <header className="mb-3 flex items-center justify-between">
          <div>
            <span className="m-0 text-[26px] font-bold text-black">
              City Impact Dashboard
            </span>
            <p className="mt-1 text-sm text-[#66716a]">Mock data · Illustrative dashboard</p>
          </div>

          <div className="flex items-center gap-[5px]">
            {/* Period switcher */}
            <div className="flex gap-[3px] rounded-[7px] border border-[#e4e8e5] bg-white p-[2px]">
              {["7 days", "30 days", "12 months"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`
                    cursor-pointer rounded-[5px]
                    border-0 px-[13px] py-1
                    text-[12px]

                    ${
                      item === "30 days"
                        ? "bg-[#111613] text-white"
                        : "bg-transparent text-black"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Export is available in API mode. */}
            <button
              type="button"
              disabled
              title="Export is available in API mode"
              className="
                cursor-pointer
                rounded-[7px]
                border border-[#e4e8e5]
                bg-white
                px-[9px]
                py-[6px]
                text-[14px]
                font-semibold
                text-black
              "
            >
            <FontAwesomeIcon
                icon={faDownload}
                className="w-[15px] shrink-0 text-center text-[15px]"
            />
             &nbsp; Export report
            </button>
          </div>
        </header>

        {/* Stats */}
        <section
          className="
            mb-[10px]
            grid
            grid-cols-5
            gap-2

            max-[900px]:grid-cols-2
          "
        >
          <StatCard
            label="Active users"
            value="18,420"
            change="+12.4%"
          />

          <StatCard
            label="Total users"
            value="46,900"
            change="+8.1%"
          />

          <StatCard
            label="Trips analysed"
            value="1.28M"
            change="+15.3%"
          />

          <StatCard
            label="Average daily usage"
            value="26"
            suffix="min"
            change="+6.5%"
          />

          <StatCard
            label="Share of drivers"
            value="14.2%"
            change="+1.6 pp"
          />
        </section>

        {/* Main dashboard */}
        <section
          className="
            grid
            grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)]
            gap-[9px]

            max-[900px]:grid-cols-1
          "
        >
          {/* Adoption panel */}
          <div className="rounded-[11px] border border-[#e8ece9] bg-white p-[10px]">
            {/* Panel header */}
            <div className="mb-[6px] flex items-center justify-between">
              <div>
                <div className="text-[17px] font-extrabold text-left">
                  Adoption & usage
                </div>

                <div className="mt-[2px] text-[13px] text-[#818a84] text-left">
                  Monthly active users, last 12 months
                </div>
              </div>

              {/* Chart switcher */}
              <div className="flex rounded-[7px] bg-[#f2f5f3] p-[2px]">
                {["Daily", "Weekly", "Monthly"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`
                      cursor-pointer
                      rounded-[5px]
                      border-0
                      px-[13px]
                      py-1
                      text-[12px]

                      ${
                        period === item
                          ? "bg-[#101411] text-white"
                          : "bg-transparent text-[#5d6660]"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-[145px] overflow-hidden px-[8px] pt-[15px] pb-[15px] pl-[28px]">
              {/* Grid */}
              <div className="absolute left-[28px] right-[7px] top-[15px] h-px bg-[#edf0ee]" />
              <div className="absolute left-[28px] right-[7px] top-[45px] h-px bg-[#edf0ee]" />
              <div className="absolute left-[28px] right-[7px] top-[75px] h-px bg-[#edf0ee]" />
              <div className="absolute left-[28px] right-[7px] top-[105px] h-px bg-[#edf0ee]" />
              <div className="absolute left-[28px] right-[7px] top-[135px] h-px bg-[#edf0ee]" />

              {/* Y labels */}
              <div className="absolute left-0 top-[7px] bottom-[5px] flex flex-col justify-between text-[11px] text-[#8a928c]">
                <span>20k</span>
                <span>15k</span>
                <span>10k</span>
                <span>5k</span>
                <span>0</span>
              </div>

              {/* SVG */}
              <svg
                className="absolute left-[29px] right-[7px] top-[14px] h-[122px] w-[calc(100%-36px)]"
                viewBox="0 0 700 120"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="user-area"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2be889"
                      stopOpacity=".25"
                    />

                    <stop
                      offset="100%"
                      stopColor="#2be889"
                      stopOpacity=".03"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 96 L64 88 L128 80 L192 69 L256 59 L320 54 L384 44 L448 35 L512 26 L576 22 L640 10 L700 4 L700 120 L0 120 Z"
                  fill="url(#user-area)"
                />

                <path
                  d="M0 96 L64 88 L128 80 L192 69 L256 59 L320 54 L384 44 L448 35 L512 26 L576 22 L640 10 L700 4"
                  fill="none"
                  stroke="#12a85c"
                  strokeWidth="2"
                />

                <circle
                  cx="700"
                  cy="4"
                  r="4"
                  fill="#ffffff"
                  stroke="#12a85c"
                  strokeWidth="2"
                />
              </svg>

              {/* Current value */}
              <div className="absolute right-[2px] top-[15px] rounded-[5px] bg-[#111613] px-[5px] py-[3px] text-[12px] font-bold text-white">
                18,420
              </div>

              {/* X labels */}
              <div className="absolute bottom-0 left-[30px] right-[5px] flex justify-between text-[11px] text-[#8a928c]">
                {[
                  "Nov",
                  "Dec",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                ].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>

            {/* Mini stats */}
            <div className="mt-[5px] grid grid-cols-4 gap-[6px]">
              <div className="rounded-[8px] bg-[#f3f5f4] p-2">
                <strong className="block text-[18px]">
                  6,240
                </strong>
                <span className="text-[12px] text-[#858d87]">
                  Daily active users
                </span>
              </div>

              <div className="rounded-[8px] bg-[#f3f5f4] p-2">
                <strong className="block text-[18px]">
                  12,870
                </strong>
                <span className="text-[12px] text-[#858d87]">
                  Weekly active users
                </span>
              </div>

              <div className="rounded-[8px] bg-[#f3f5f4] p-2">
                <strong className="block text-[18px]">
                  42,600
                </strong>
                <span className="text-[12px] text-[#858d87]">
                  Trips per day
                </span>
              </div>

              <div className="rounded-[8px] bg-[#f3f5f4] p-2">
                <strong className="block text-[18px]">
                  24 min
                </strong>
                <span className="text-[12px] text-[#858d87]">
                  Avg. trip · 9.6 km
                </span>
              </div>
            </div>

            {/* Districts */}
            <div className="mt-6">
              <div className="mb-[6px] flex justify-between text-[12px]">
                <strong>Usage by district</strong>
                <span className="text-[#838b85]">
                  Share of trips
                </span>
              </div>

              {districtData.map((district) => (
                <div
                  className="mb-[6px] grid grid-cols-[52px_1fr_25px] items-center gap-[5px] text-[12px] text-left"
                  key={district.name}
                >
                  <span>{district.name}</span>

                  <div className="h-[4px] overflow-hidden rounded-full bg-[#e0e5e2]">
                    <div
                      className="h-full rounded-full bg-[#2be78a]"
                      style={{
                        width: `${district.value}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-[#555e58]">
                    {district.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact panel */}
          <div className="rounded-[11px] border border-[#e8ece9] bg-white p-[10px]">
            <div className="text-[17px] font-extrabold">
              Impact vs. city goals
            </div>

            <div className="mt-[2px] text-[13px] text-[#818a84]">
              Baseline · Current · Target
            </div>

            <ImpactMetricCard
              title="Traffic congestion"
              subtitle="Peak-hour delay vs free flow"
              baseline="42%"
              current="37%"
              target="30%"
              progress={42}
              badge="12% improvement"
            />

            <ImpactMetricCard
              title="CO₂ / GHG emissions"
              subtitle="Road traffic, tonnes CO₂e per month"
              baseline="4,820 t"
              current="4,415 t"
              target="4,190 t"
              progress={64}
              badge="8.4% reduction"
            />

            <ImpactMetricCard
              title="Avg. waiting time at traffic lights"
              subtitle="Minutes per trip"
              baseline="9.8 min"
              current="5.6 min"
              target="4.5 min"
              progress={79}
              badge="8.4% reduction"
            />
          </div>
        </section>

        {/* Footer */}
        <footer
          className="
            mt-[9px]
            grid
            min-h-[68px]
            grid-cols-[145px_repeat(4,1fr)]
            items-center
            rounded-[11px]
            border border-[#e8ece9]
            bg-white
            px-[14px]
            py-[9px]
          "
        >
          {/* Mobility score */}
          <div className="flex items-center gap-[9px]">
            <div
              className="
                grid h-[60px] w-[60px]
                place-items-center
                rounded-full
                border-[5px]
                border-[#dce5df]
                border-t-[#29e889]
                border-r-[#29e889]
                text-[12px]
              "
            >
               <strong className="text-[20px]">
                  72
                </strong>

            </div>

            <div>
              <span className="text-[9px] text-[#777f79]">
                CITY SCORE
              </span>

              <div>

              </div>
            </div>
          </div>

          {/* Footer metrics */}
          <div className="border-l border-[#e8ece9] pl-[14px]">
            <strong className="block text-[24px] text-[#0a8247]">
              −12%
            </strong>

            <span className="text-[10px] text-[#778079]">
              Congestion reduction
            </span>
          </div>

          <div className="border-l border-[#e8ece9] pl-[14px]">
            <strong className="block text-[24px] text-[#0a8247]">
              −8.4%
            </strong>

            <span className="text-[10px] text-[#778079]">
              Estimated CO₂ reduction
            </span>
          </div>

          <div className="border-l border-[#e8ece9] pl-[14px]">
            <strong className="block text-[24px] text-[#0a8247]">
              4.2 min / trip
            </strong>

            <span className="text-[10px] text-[#778079]">
              Average time saved
            </span>
          </div>

          <div className="border-l border-[#e8ece9] pl-[14px]">
            <strong className="block text-[24px] text-[#0a8247]">
              64%
            </strong>

            <span className="text-[10px] text-[#778079]">
              ESG target completion
            </span>

            <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-[#dfe4e1]">
              <div className="h-full w-[64%] rounded-full bg-[#2be78a]" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default CityImpactMockPage;