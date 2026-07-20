"use client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import EventCTA from "@/components/EventCTA";
import { useEventsStore } from "@/store/eventsStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(ScrollTrigger);

const EMBED_SRC = "https://www.unicorn.studio/embed/ATGD5bKuLj8x2tOWjnD7";

/**
 * @typedef {import("@prismicio/client").Content.EventsSlice} EventsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<EventsSlice>} EventsProps
 * @type {import("react").FC<EventsProps>}
 */
const EVENTS_PER_PAGE = 2;

const EventCard = ({ item }) => (
  <div className="flex items-center gap-4 p-4 md:p-2 border border-[#FF6A50] lg:border-[#04050F] lg:hover:border-[#FF6A50] duration-500 transition-colors">
    <div className="hidden lg:block lg:w-30 xl:w-40 h-auto shrink-0 overflow-hidden bg-white/5">
      <PrismicNextImage
        field={item.icon}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-white/50 text-base lg:text-sm xl:text-base mb-1 font-mono font-normal tracking-wide">
        <PrismicRichText field={item.location} />
      </span>
      <span className="text-white font-medium text-xl lg:text-xl xl:text-2xl leading-tight">
        <PrismicRichText field={item.title} />
      </span>
      <span className="text-white/50 text-sm lg:text-base xl:text-lg mt-0.5">
        <PrismicRichText field={item.date} />
      </span>
      <div className="md:hidden mt-3">
        {item.cta_button && (
          <EventCTA innerClassName="text-sm!" link={item.cta_button} />
        )}
      </div>
    </div>
    <div className="hidden md:block">
      {item.cta_button && <EventCTA link={item.cta_button} />}
    </div>
  </div>
);

const Events = ({ slice }) => {
  const activeTab = useEventsStore((state) => state.activeTab);
  const setActiveTab = useEventsStore((state) => state.setActiveTab);
  const headingRef = useRef(null);
  const iframeRef = useRef(null);
  const innerContainerRef = useRef(null);
  const sectionRef = useRef(null);

  const [shouldLoadEmbed, setShouldLoadEmbed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
  });
  const [selectedSlide, setSelectedSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedSlide(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.scrollTo(0);
    setSelectedSlide(0);
  }, [activeTab, emblaApi]);

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
      const rawDate = item.date_text;
      if (!rawDate) return;
      const eventDate = new Date(rawDate);
      eventDate.setHours(0, 0, 0, 0);
      const entry = { item, eventDate };
      if (eventDate >= today) {
        upcoming.push(entry);
      } else {
        past.push(entry);
      }
    });

    upcoming.sort((a, b) => a.eventDate - b.eventDate);
    past.sort((a, b) => b.eventDate - a.eventDate);

    return {
      upcomingEvents: upcoming.map((e) => e.item),
      pastEvents: past.map((e) => e.item),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const allDisplayedEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  const groupedSlides = useMemo(() => {
    const groups = [];
    for (let i = 0; i < allDisplayedEvents.length; i += 2) {
      groups.push(allDisplayedEvents.slice(i, i + 2));
    }
    return groups;
  }, [allDisplayedEvents]);
  const totalPages = Math.max(
    1,
    Math.ceil(allDisplayedEvents.length / EVENTS_PER_PAGE),
  );

  const displayedEvents = allDisplayedEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE,
  );

  const getEventKey = (item, index) =>
    item.id ??
    `${item.title?.[0]?.text ?? "event"}-${item.date?.[0]?.text ?? index}`;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <section
      ref={sectionRef}
      id="events"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full  lg:px-9  mb-22.5 md:mb-45 bg-[#04050F]"
    >
      <div className="h-full">
        <div
          ref={iframeRef}
          className={`${totalPages > 1 ? "  h-173 md:h-135 lg:h-145 xl:h-180" : " h-163 md:h-115 lg:h-135 xl:h-165 4xl:h-160"} lg:px-15 relative opacity-0 flex items-start justify-center xl:px-24 2xl:px-30 4xl:px-33.25`}
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
          {/* Inner Container */}
          <div className="absolute w-full h-fit lg:w-180 xl:w-250 4xl:w-300 4xl:h-fit z-102 px-3 mt-8 md:mt-8 lg:mt-14 xl:mt-20 4xl:mt-15">
            <div
              ref={headingRef}
              className="text-black  opacity-0 w-fit inline-flex text-[28px] xl:text-[42px] leading-none font-medium mb-5 4xl:mb-5"
            >
              <PrismicRichText field={slice.primary.main_heading} />
            </div>
            {/* Tabs Container */}
            <div
              ref={innerContainerRef}
              className="w-full  opacity-0 bg-[#04050F] p-1  "
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
                      onClick={() => handleTabChange("upcoming")}
                      className={`flex items-center text-sm  lg:text-sm xl:text-lg cursor-pointer gap-2  font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
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
                      onClick={() => handleTabChange("past")}
                      className={`flex items-center text-sm lg:text-sm xl:text-lg gap-2 cursor-pointer  font-medium transition-colors whitespace-nowrap rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation ${
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
              {/* Event List */}
              <div
                role="tabpanel"
                id="events-tabpanel"
                aria-labelledby={
                  activeTab === "upcoming"
                    ? "events-tab-upcoming"
                    : "events-tab-past"
                }
                className="border-x border-b p-4 border-white/10"
              >
                {/* Mobile: Embla Carousel */}
                <div className="md:hidden">
                  {allDisplayedEvents.length === 0 ? (
                    <p className="text-white/40 text-sm py-6 text-center">
                      No {activeTab} events at the moment.
                    </p>
                  ) : (
                    <>
                      <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-3">
                          {groupedSlides.map((group, slideIndex) => (
                            <div
                              key={slideIndex}
                              className="flex-[0_0_100%] min-w-0 flex flex-col gap-3"
                            >
                              {group.map((item, itemIndex) => (
                                <EventCard
                                  key={getEventKey(
                                    item,
                                    slideIndex * 2 + itemIndex,
                                  )}
                                  item={item}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      {groupedSlides.length > 1 && (
                        <div
                          className="flex items-center justify-center gap-2 pt-4"
                          role="tablist"
                          aria-label="Event slides"
                        >
                          {groupedSlides.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              role="tab"
                              aria-selected={selectedSlide === index}
                              aria-label={`Go to event ${index + 1}`}
                              onClick={() =>
                                emblaApi && emblaApi.scrollTo(index)
                              }
                              className={`h-2 rounded-full cursor-pointer transition-all touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] ${
                                selectedSlide === index
                                  ? "w-6 bg-[#FF6A50]"
                                  : "w-2 bg-white/25 hover:bg-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Desktop: Paginated List */}
                <div
                  className={`hidden md:flex justify-between gap-3 flex-col ${totalPages > 1 ? "md:min-h-65 lg:min-h-70 xl:min-h-88" : "min-h-auto"}`}
                >
                  <div className="flex flex-col gap-3">
                    {displayedEvents.length === 0 ? (
                      <p className="text-white/40 text-sm py-6 text-center">
                        No {activeTab} events at the moment.
                      </p>
                    ) : (
                      displayedEvents.map((item, index) => (
                        <EventCard key={getEventKey(item, index)} item={item} />
                      ))
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white cursor-pointer disabled:text-white/25 hover:text-[#FF6A50] disabled:hover:text-white/25 transition-colors touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
                      >
                        <svg
                          width="8"
                          height="14"
                          viewBox="0 0 8 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 1L1 7L7 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <span className="text-white/50 text-sm font-mono tabular-nums">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer text-white disabled:text-white/25 hover:text-[#FF6A50] disabled:hover:text-white/25 transition-colors touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
                      >
                        <svg
                          width="8"
                          height="14"
                          viewBox="0 0 8 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 1L7 7L1 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
