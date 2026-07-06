"use client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import EventCTA from "@/components/EventCTA";
import { useEventsStore } from "@/store/eventsStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const EMBED_SRC = "https://www.unicorn.studio/embed/ATGD5bKuLj8x2tOWjnD7";

/**
 * @typedef {import("@prismicio/client").Content.EventsSlice} EventsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<EventsSlice>} EventsProps
 * @type {import("react").FC<EventsProps>}
 */
const Events = ({ slice }) => {
  const activeTab = useEventsStore((state) => state.activeTab);
  const setActiveTab = useEventsStore((state) => state.setActiveTab);
  const headingRef = useRef(null);
  const iframeRef = useRef(null);
  const innerContainerRef = useRef(null);
  const sectionRef = useRef(null);

  const [shouldLoadEmbed, setShouldLoadEmbed] = useState(false);

  useEffect(() => {
    if (shouldLoadEmbed) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadEmbed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadEmbed]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(iframeRef.current, { opacity: 1 });
        gsap.set(headingRef.current, { y: 0, opacity: 1 });
        gsap.set(innerContainerRef.current, { y: 0, opacity: 1 });
        return;
      }

      gsap.set([iframeRef.current, innerContainerRef.current], {
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: iframeRef.current,
          start: "top 70%",
          once: true,
        },
        onComplete: () => {
          gsap.set([iframeRef.current, innerContainerRef.current], {
            willChange: "auto",
          });
        },
      });

      tl.fromTo(
        iframeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
      ).fromTo(
        [headingRef.current, innerContainerRef.current],
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1 },
      );
    }, iframeRef);

    return () => ctx.revert();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = slice.primary.events ?? [];

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const upcoming = [];
    const past = [];

    events.forEach((item) => {
      const rawDate = item.date?.[0]?.text;
      if (!rawDate) return;
      const eventDate = new Date(rawDate);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate >= today) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    });

    return { upcomingEvents: upcoming, pastEvents: past };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const displayedEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const getEventKey = (item, index) =>
    item.id ??
    `${item.title?.[0]?.text ?? "event"}-${item.date?.[0]?.text ?? index}`;

  return (
    <section
      ref={sectionRef}
      id="events"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full  lg:px-9  mb-22.5 md:mb-45"
    >
      <div className="">
        <div
          ref={iframeRef}
          className="lg:px-15 h-110 lg:h-120 xl:h-150 relative opacity-0 flex items-center justify-center xl:px-24 2xl:px-30 4xl:px-33.25"
        >
          {shouldLoadEmbed && (
            <iframe
              src={EMBED_SRC}
              title=""
              aria-hidden="true"
              tabIndex={-1}
              className="lg:w-[1569px] w-full h-full z-100"
              allowFullScreen
            />
          )}
          <div className="absolute w-full h-fit lg:w-180 xl:w-250 4xl:w-300 4xl:h-fit z-102 px-3">
            <div
              ref={headingRef}
              className="text-black opacity-0 text-[28px] xl:text-[42px] leading-none font-medium mb-5 4xl:mb-5"
            >
              <PrismicRichText field={slice.primary.main_heading} />
            </div>

            <div
              ref={innerContainerRef}
              className="w-full opacity-0 bg-[#04050F] p-1  "
            >
              <div className="flex items-center border border-white/10 p-5 justify-between w-full">
                <div className="text-white/60 text-sm">
                  <PrismicRichText field={slice.primary.description} />
                </div>

                <div className="flex flex-col md:flex-row w-full md:items-center justify-between gap-6 ">
                  {activeTab === "upcoming" ? (
                    <div className="text-white text-xl  lg:text-lg xl:text-xl font-medium">
                      <PrismicRichText
                        field={slice.primary.upcomingeventsheading}
                      />
                    </div>
                  ) : (
                    <div className="text-white text-xl lg:text-lg xl:text-xl font-medium">
                      <PrismicRichText
                        field={slice.primary.pasteventsheading}
                      />
                    </div>
                  )}
                  <div
                    role="tablist"
                    aria-label="Event timeframe"
                    className="flex w-fit  gap-6 shrink-0"
                  >
                    <button
                      type="button"
                      role="tab"
                      id="events-tab-upcoming"
                      aria-selected={activeTab === "upcoming"}
                      aria-controls="events-tabpanel"
                      onClick={() => setActiveTab("upcoming")}
                      className={`flex items-center text-xs  lg:text-sm xl:text-lg cursor-pointer gap-2  font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
                        activeTab === "upcoming"
                          ? "text-white"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full inline-block transition-colors ${
                          activeTab === "upcoming"
                            ? "bg-[#FF6A50]"
                            : "bg-[#04050F]"
                        }`}
                      />
                      <span>Upcoming Events</span>
                    </button>

                    <button
                      type="button"
                      role="tab"
                      id="events-tab-past"
                      aria-selected={activeTab === "past"}
                      aria-controls="events-tabpanel"
                      onClick={() => setActiveTab("past")}
                      className={`flex items-center text-xs lg:text-sm xl:text-lg gap-2 cursor-pointer  font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
                        activeTab === "past"
                          ? "text-white "
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full inline-block transition-colors ${
                          activeTab === "past" ? "bg-[#FF6A50]" : "bg-[#04050F]"
                        }`}
                      />
                      <span>Past Events</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                role="tabpanel"
                id="events-tabpanel"
                aria-labelledby={
                  activeTab === "upcoming"
                    ? "events-tab-upcoming"
                    : "events-tab-past"
                }
                className="flex border-x border-b p-4 border-white/10 flex-col gap-3"
              >
                {displayedEvents.length === 0 ? (
                  <p className="text-white/40 text-sm py-6 text-center">
                    No {activeTab} events at the moment.
                  </p>
                ) : (
                  displayedEvents.map((item, index) => (
                    <div
                      key={getEventKey(item, index)}
                      className="flex  items-center gap-4 p-4 md:p-2 border border-[#FF6A50] lg:border-[#04050F] lg:hover:border-[#FF6A50] transition-colors"
                    >
                      <div className="hidden lg:block lg:w-30 xl:w-40 h-auto shrink-0  overflow-hidden bg-white/5">
                        <PrismicNextImage
                          field={item.icon}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col  flex-1 min-w-0">
                        <span className="text-white/50 text-base lg:text-sm xl:text-base mb-1 font-mono font-normal tracking-wide">
                          <PrismicRichText field={item.location} />
                        </span>
                        <span className="text-white font-medium text-xl lg:text-xl xl:text-2xl  leading-tight">
                          <PrismicRichText field={item.title} />
                        </span>
                        <span className="text-white/50  text-sm lg:text-base xl:text-lg mt-0.5">
                          <PrismicRichText field={item.date} />
                        </span>
                        <div className="md:hidden mt-3 ">
                          {item.cta_button && (
                            <EventCTA
                              innerClassName="text-sm!"
                              link={item.cta_button}
                            />
                          )}
                        </div>
                      </div>

                      <div className="hidden md:block">
                        {item.cta_button && <EventCTA link={item.cta_button} />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
