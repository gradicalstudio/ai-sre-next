"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import NavDropdown from "../NavDropdown";
import { useEventsStore } from "@/store/eventsStore";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavCtaButton from "./NavCtaButton";
gsap.registerPlugin(ScrollTrigger);

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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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
    aria-hidden="true"
    focusable="false"
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const HeaderClient = ({ brand_logo, nav_links = [], nav_cta }) => {
  const [activeId, setActiveId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsAccordionOpen, setEventsAccordionOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const mobileNavRef = useRef(null);
  const eventsTriggerRef = useRef(null);
  const logoRef = useRef(null);
  const desktopNavRef = useRef(null);
  const desktopCtaRef = useRef(null);
  const mobileCtaRef = useRef(null);

  const activeEventTab = useEventsStore((state) => state.activeTab);
  const setActiveEventTab = useEventsStore((state) => state.setActiveTab);

  useEffect(() => {
    const ids = nav_links.map((item) => getHashId(item)).filter(Boolean);
    if (ids.length === 0) return;

    let triggers = [];
    let mo;
    let mm;

    const setup = () => {
      mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 1023px)",
          isLg: "(min-width: 1024px) and (max-width: 1279px)",
          isXl: "(min-width: 1280px) and (max-width: 1535px)",
          is2xl: "(min-width: 1536px) and (max-width: 1799px)",
          is4xl: "(min-width: 1800px)",
        },
        (context) => {
          const { isMobile, isLg, isXl, is2xl, is4xl } = context.conditions;

          const getStart = () => {
            if (isMobile) return "top 40%";
            if (isLg) return "bottom bottom-=150";
            if (isXl) return "bottom bottom";
            if (is2xl) return "bottom bottom";
            if (is4xl) return "bottom bottom";
            return "bottom bottom";
          };

          const elements = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean);

          triggers = elements.map((el) =>
            ScrollTrigger.create({
              trigger: el,
              start: getStart(),
              end: isMobile ? "bottom 70%" : "20% 0%",
              // markers: process.env.NODE_ENV === "development",
              onEnter: () => setActiveId(el.id),
              onEnterBack: () => setActiveId(el.id),
              onLeave: () => setActiveId((cur) => (cur === el.id ? null : cur)),
              onLeaveBack: () =>
                setActiveId((cur) => (cur === el.id ? null : cur)),
            }),
          );

          return () => {
            triggers.forEach((t) => t.kill());
            triggers = [];
          };
        },
      );
    };

    if (ids.every((id) => document.getElementById(id))) {
      setup();
    } else {
      mo = new MutationObserver(() => {
        if (ids.every((id) => document.getElementById(id))) {
          setup();
          mo.disconnect();
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", () => ScrollTrigger.refresh());

    return () => {
      mo?.disconnect();
      mm?.revert();
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [nav_links]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = [
      logoRef.current,
      ...(desktopNavRef.current
        ? desktopNavRef.current.querySelectorAll(":scope > *")
        : []),
      desktopCtaRef.current,
      mobileCtaRef.current,
      menuToggleRef.current,
    ].filter(Boolean);

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { filter: "blur(16px)", x: -24 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(logoRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        duration: 1,
      })
        .to(
          desktopNavRef.current
            ? desktopNavRef.current.querySelectorAll(":scope > *")
            : [],
          {
            opacity: 1,
            filter: "blur(0px)",
            x: 0,
            duration: 0.9,
            stagger: 0.08,
          },
          "-=0.6",
        )
        .to(
          [desktopCtaRef.current, mobileCtaRef.current, menuToggleRef.current],
          { opacity: 1, filter: "blur(0px)", x: 0, duration: 0.7 },
          "-=0.4",
        )
        .set(targets, { clearProps: "opacity,filter,transform" });
    });

    return () => ctx.revert();
  }, [nav_links]);

  useEffect(() => {
    if (!mobileOpen) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const panel = mobileNavRef.current;
    const items = panel ? panel.querySelectorAll(":scope > *") : [];
    if (items.length === 0) return;

    if (prefersReduced) {
      gsap.set(items, { opacity: 1, filter: "blur(0px)", x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, filter: "blur(16px)", x: -24 });
      gsap.to(items, {
        opacity: 1,
        filter: "blur(0px)",
        x: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power4.out",
        onComplete: () =>
          gsap.set(items, { clearProps: "opacity,filter,transform" }),
      });
    });

    return () => ctx.revert();
  }, [mobileOpen]);

  const closeMobileMenu = useCallback(({ returnFocus = true } = {}) => {
    setMobileOpen(false);
    setEventsAccordionOpen(false);
    if (returnFocus) {
      menuToggleRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const panel = mobileNavRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, eventsAccordionOpen, closeMobileMenu]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMobileMenu({ returnFocus: false });
  };

  const handleMobileEventClick = (tab) => {
    setActiveEventTab(tab);
    closeMobileMenu({ returnFocus: false });

    setTimeout(() => {
      document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <header className=" sticky top-0 z-500 bg-[#04050F] text-white">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-9 h-16 lg:h-15">
        {/* Brand logo */}
        <Link
          ref={logoRef}
          href="/"
          style={{ opacity: 0 }}
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
        >
          <PrismicNextImage
            field={brand_logo}
            className="h-8 lg:h-8 w-auto cursor-pointer"
          />
        </Link>

        <div className="flex items-center gap-10">
          {/* Desktop nav */}
          <nav
            ref={desktopNavRef}
            aria-label="Primary"
            className="hidden lg:flex font-mono text-white items-center gap-8"
          >
            {nav_links.map((item, index) => {
              const id = getHashId(item);
              const isActive = id && id === activeId;
              const isEventsLink =
                item.text?.toLowerCase() === "events" || id === "events";

              if (isEventsLink) {
                return (
                  <div key={item.key ?? index} style={{ opacity: 0 }}>
                    <NavDropdown item={item} isActive={isActive} />
                  </div>
                );
              }

              return (
                <a
                  key={item.key ?? index}
                  href={item?.url ?? "#"}
                  style={{ opacity: 0 }}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => {
                    if (id) {
                      handleNavClick(e, id);
                    } else if (!item?.url) {
                      e.preventDefault();
                    }
                  }}
                  className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-sm  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] ${
                    isActive ? "text-white" : "text-white hover:text-white/80"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-2 h-2  rounded-full inline-block transition-colors ${
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
          <div ref={desktopCtaRef} style={{ opacity: 0 }}>
            <NavCtaButton field={nav_cta} className="hidden lg:block">
              {nav_cta?.text || "Register for Meetup"}
            </NavCtaButton>
          </div>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex lg:hidden items-center gap-4">
          <PrismicNextLink
            ref={mobileCtaRef}
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            style={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs font-medium rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation"
          >
            {nav_cta?.text || "Register for Meetup"}
            <span className="sr-only"> (opens in a new tab)</span>
            <span className="text-[#FF6A50]">
              <ArrowAsset arrowAssetClass="size-4 mt-px" />
            </span>
          </PrismicNextLink>

          <button
            ref={menuToggleRef}
            type="button"
            onClick={() =>
              mobileOpen
                ? closeMobileMenu({ returnFocus: false })
                : setMobileOpen(true)
            }
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            style={{ opacity: 0 }}
            className="cursor-pointer p-2.5 -m-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation"
          >
            {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          ref={mobileNavRef}
          className="lg:hidden flex flex-col gap-1 px-4 pb-6 bg-[#04050F] border-t border-white/10 overscroll-contain"
        >
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
                    ref={eventsTriggerRef}
                    type="button"
                    onClick={() => setEventsAccordionOpen((prev) => !prev)}
                    aria-expanded={eventsAccordionOpen}
                    aria-controls="mobile-events-panel"
                    className={`flex items-center justify-between w-full py-3 text-base font-medium uppercase tracking-wide transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
                      isActive ? "text-white" : "text-white/50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
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
                      aria-hidden="true"
                      focusable="false"
                      className={`motion-safe:transition-transform motion-safe:duration-200 ${eventsAccordionOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Accordion body */}
                  {eventsAccordionOpen && (
                    <div
                      id="mobile-events-panel"
                      className="flex flex-col pl-5 mb-2 border-l border-white/10"
                    >
                      {DROPDOWN_ITEMS.map(({ label, tab }) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => handleMobileEventClick(tab)}
                          aria-current={
                            isActive && activeEventTab === tab
                              ? "true"
                              : undefined
                          }
                          className="flex items-center gap-2 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors text-left rounded-sm  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation"
                        >
                          {/* only orange when this tab is active AND user is in the events section */}
                          <span
                            aria-hidden="true"
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
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  if (id) {
                    handleNavClick(e, id);
                  } else if (!item?.url) {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center gap-3 py-3 text-base font-medium uppercase tracking-wide transition-colors rounded-sm  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                <span
                  aria-hidden="true"
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
