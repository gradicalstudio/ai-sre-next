"use client";
import { useState, useRef } from "react";
import { useEventsStore } from "@/store/eventsStore";

const DROPDOWN_ITEMS = [
  { label: "Upcoming Events", tab: "upcoming" },
  { label: "Past Events", tab: "past" },
];

export default function NavDropdown({ item, isActive }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);
  const activeTab = useEventsStore((state) => state.activeTab);
  const setActiveTab = useEventsStore((state) => state.setActiveTab);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative z-999"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href="#events"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("events")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
          isActive ? "text-white" : "text-white hover:text-white/80"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full inline-block transition-colors ${
            isActive ? "bg-[#FF6A50]" : "bg-transparent border border-white"
          }`}
        />
        {item.text}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M1.5 3.5L5 7L8.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>

      {open && (
        <div className="absolute top-full -left-10 mt-3 w-44 bg-[#04050F] flex flex-col z-200">
          {DROPDOWN_ITEMS.map(({ label, tab }) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setOpen(false);
                setTimeout(() => {
                  document
                    .getElementById("events")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="flex items-center group gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide hover:bg-white/5 transition-colors text-left"
            >
              <span
                className={`w-1.5 h-1.5 group-hover:bg-[#FF6A50]  group-hover:border-[#FF6A50] rounded-full shrink-0 transition-colors ${
                  isActive && activeTab === tab
                    ? "bg-[#FF6A50]"
                    : "bg-transparent border border-white/30"
                }`}
              />
              <span
                className={` group-hover:text-[white] ${
                  isActive && activeTab === tab
                    ? "text-white"
                    : "text-white/60"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}