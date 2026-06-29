"use client";

import { useEffect, useState, useRef } from "react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import NavDropdown from "./NavDropdown";

const MenuIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M8.67057 16.6676H6.00391V14.001H8.67057V16.6676Z" fill="white" />
    <path d="M11.3307 13.9997H8.66406V11.333H11.3307V13.9997Z" fill="white" />
    <path d="M14.0026 11.3337H11.3359V8.66699H14.0026V11.3337Z" fill="white" />
    <path d="M8.67057 11.3337H6.00391V8.66699H8.67057V11.3337Z" fill="white" />
    <path d="M11.3307 8.66569H8.66406V5.99902H11.3307V8.66569Z" fill="white" />
    <path d="M8.67057 5.99967H6.00391V3.33301H8.67057V5.99967Z" fill="white" />
  </svg>
);

const ArrowAsset = ({ arrowAssetClass }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={arrowAssetClass}
  >
    <path
      d="M4.19657 8.06376H2.90625V6.77344H4.19657V8.06376Z"
      fill="#FF6A50"
    />
    <path d="M5.48564 6.77274H4.19531V5.48242H5.48564V6.77274Z" fill="white" />
    <path d="M6.7786 5.48368H5.48828V4.19336H6.7786V5.48368Z" fill="#FF6A50" />
    <path d="M4.19657 5.48173H2.90625V4.19141H4.19657V5.48173Z" fill="white" />
    <path
      d="M5.48564 4.19267H4.19531V2.90234H5.48564V4.19267Z"
      fill="#FF6A50"
    />
    <path d="M4.19657 2.90165H2.90625V1.61133H4.19657V2.90165Z" fill="white" />
  </svg>
);

const DROPDOWN_ITEMS = [
  { label: "Upcoming Events", tab: "upcoming" },
  { label: "Past Events", tab: "past" },
];

const getHashId = (link) => {
  const url = link?.url ?? "";
  const hashIndex = url.indexOf("#");
  return hashIndex !== -1 ? url.slice(hashIndex + 1) : null;
};

const HeaderClient = ({ brand_logo, nav_links = [], nav_cta }) => {
  const [activeId, setActiveId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsAccordionOpen, setEventsAccordionOpen] = useState(false);
  const observerRef = useRef(null);
  const [activeEventTab, setActiveEventTab] = useState();

  useEffect(() => {
    const ids = nav_links.map((item) => getHashId(item)).filter(Boolean);
    if (ids.length === 0) return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return;
    const ratios = new Map();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });

        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        setActiveId(bestRatio > 0 ? bestId : null);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    sections.forEach((section) => observerRef.current.observe(section));
    return () => observerRef.current?.disconnect();
  }, [nav_links]);
  
  useEffect(() => {
    const handler = (e) => setActiveEventTab(e.detail);
    window.addEventListener("tabchange", handler);
    return () => window.removeEventListener("tabchange", handler);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  // ✅ handles mobile dropdown item click — sets tab param, closes menu, smooth scrolls
  const handleMobileEventClick = (tab) => {
    setActiveEventTab(tab); // ✅ track which sub-item is active
    setMobileOpen(false);
    setEventsAccordionOpen(false);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.pathname + url.search);
    window.dispatchEvent(new Event("popstate"));

    setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-350 bg-[#04050F] text-white">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-9 h-16 lg:h-15">
        {/* Brand logo */}
        <Link href="/">
          <PrismicNextImage
            field={brand_logo}
            className="h-8 lg:h-8 w-auto cursor-pointer"
          />
        </Link>

        <div className="flex gap-10">
          {/* Desktop nav */}
          <nav className="hidden lg:flex font-mono text-white items-center gap-8">
            {nav_links.map((item, index) => {
              const id = getHashId(item);
              const isActive = id && id === activeId;
              const isEventsLink =
                item.text?.toLowerCase() === "events" || id === "events";

              if (isEventsLink) {
                return (
                  <NavDropdown
                    key={item.key ?? index}
                    item={item}
                    isActive={isActive}
                    activeEventTab={activeEventTab}
                    onTabChange={setActiveEventTab}
                  />
                );
              }

              return (
                <a
                  key={item.key ?? index}
                  href={item?.url ?? "#"}
                  onClick={(e) => id && handleNavClick(e, id)}
                  className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isActive ? "text-white" : "text-white hover:text-white/80"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full inline-block transition-colors ${
                      isActive
                        ? "bg-[#FF6A50]"
                        : "bg-transparent border border-white"
                    }`}
                  />
                  {item.text}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <PrismicNextLink
              field={nav_cta}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#242424] hover:bg-white/20 transition-colors text-sm font-medium px-4 py-2 rounded-full"
            >
              {nav_cta?.text || "Register for Meetup"}
              <span className="text-[#FF6A50]">
                <ArrowIcon className="size-4 mt-0.5" />
              </span>
            </PrismicNextLink>
          </div>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex lg:hidden items-center gap-4">
          <PrismicNextLink
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            {nav_cta?.text || "Register for Meetup"}
            <span className="text-[#FF6A50]">
              <ArrowAsset arrowAssetClass="size-4 mt-px" />
            </span>
          </PrismicNextLink>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="cursor-pointer"
          >
            {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav className="lg:hidden flex flex-col gap-1 px-4 pb-6 bg-[#04050F] border-t border-white/10">
          {nav_links.map((item, index) => {
            const id = getHashId(item);
            const isActive = id && id === activeId;
            const isEventsLink =
              item.text?.toLowerCase() === "events" || id === "events";

            if (isEventsLink) {
              return (
                <div key={item.key ?? index}>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => setEventsAccordionOpen((prev) => !prev)}
                    className={`flex items-center justify-between w-full py-3 text-base font-medium uppercase tracking-wide transition-colors ${
                      isActive ? "text-white" : "text-white/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full inline-block shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#FF6A50]"
                            : "bg-transparent border border-white/30"
                        }`}
                      />
                      {item.text}
                    </span>
                    {/* Chevron rotates when open */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${eventsAccordionOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Accordion body */}
                  {eventsAccordionOpen && (
                    <div className="flex flex-col pl-5 mb-2 border-l border-white/10">
                      {DROPDOWN_ITEMS.map(({ label, tab }) => (
                        <button
                          key={tab}
                          onClick={() => handleMobileEventClick(tab)}
                          className="flex items-center gap-2 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors text-left"
                        >
                          {/* ✅ only orange when this tab is active AND user is in the events section */}
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                              isActive && activeEventTab === tab
                                ? "bg-[#FF6A50]"
                                : "bg-transparent border border-white/30"
                            }`}
                          />
                          <span
                            className={
                              isActive && activeEventTab === tab
                                ? "text-white"
                                : "text-white/50"
                            }
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

            return (
              <a
                key={item.key ?? index}
                href={item?.url ?? "#"}
                onClick={(e) => id && handleNavClick(e, id)}
                className={`flex items-center gap-3 py-3 text-base font-medium uppercase tracking-wide transition-colors ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full inline-block shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#FF6A50]"
                      : "bg-transparent border border-white/30"
                  }`}
                />
                {item.text}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default HeaderClient;
