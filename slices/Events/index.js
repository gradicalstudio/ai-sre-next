"use client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { useState } from "react";
import EventCTA from "@/components/EventCTA";

/**
 * @typedef {import("@prismicio/client").Content.EventsSlice} EventsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<EventsSlice>} EventsProps
 * @type {import("react").FC<EventsProps>}
 */
const Events = ({ slice }) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = slice.primary.events ?? [];

  const upcomingEvents = events.filter((item) => {
    const rawDate = item.date?.[0]?.text;
    if (!rawDate) return false;
    const eventDate = new Date(rawDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const pastEvents = events.filter((item) => {
    const rawDate = item.date?.[0]?.text;
    if (!rawDate) return false;
    const eventDate = new Date(rawDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  const displayedEvents =
    activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <section
      id="events"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full  lg:px-9  mb-22.5 md:mb-45"
    >
      <div className="">
        <div className="lg:px-15 h-110 lg:h-120 xl:h-150 relative flex items-center justify-center xl:px-24 2xl:px-30 4xl:px-33.25">
          <iframe
            src="https://www.unicorn.studio/embed/ATGD5bKuLj8x2tOWjnD7"
            loading="lazy"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="lg:w-[1569px] w-full h-full z-100"
            allowFullScreen
          />
          {/* The middle box */}
          <div
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className=" text-white  absolute w-full h-fit lg:w-180 xl:w-250 4xl:w-300 4xl:h-fit z-102 px-3 "
          >
            {/* Heading */}
            <div className="text-black text-[28px] xl:text-[42px] leading-none font-medium mb-5 4xl:mb-5">
              <PrismicRichText field={slice.primary.main_heading} />
            </div>

            {/* Content Container */}
            <div className="w-full  bg-[#04050F] p-1  ">
              {/* Top row: description on left, tabs on right */}
              <div className="flex items-center border border-white/10 p-5 justify-between w-full">
                {/* Description / sub-heading text */}
                <div className="text-white/60 text-sm">
                  <PrismicRichText field={slice.primary.description} />
                </div>

                {/* Tab bar */}
                <div className="flex flex-col md:flex-row w-full md:items-center justify-between gap-6 ">
                  {activeTab === "upcoming" ? (
                    <div className="text-white text-sm  lg:text-lg xl:text-xl font-medium">
                      <PrismicRichText
                        field={slice.primary.upcomingeventsheading}
                      />
                    </div>
                  ) : (
                    <div className="text-white text-sm lg:text-lg xl:text-xl font-medium">
                      <PrismicRichText
                        field={slice.primary.pasteventsheading}
                      />
                    </div>
                  )}
                  <div className="flex w-fit  gap-6 shrink-0">
                    <button
                      onClick={() => setActiveTab("upcoming")}
                      className={`flex items-center text-xs  lg:text-sm xl:text-lg cursor-pointer gap-2  font-medium transition-colors whitespace-nowrap ${
                        activeTab === "upcoming"
                          ? "text-white"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full inline-block transition-colors ${
                          activeTab === "upcoming"
                            ? "bg-[#FF6A50]"
                            : "bg-[#04050F]"
                        }`}
                      />
                      <p>Upcoming Events</p>
                    </button>

                    <button
                      onClick={() => setActiveTab("past")}
                      className={`flex items-center text-xs lg:text-sm xl:text-lg gap-2 cursor-pointer  font-medium transition-colors whitespace-nowrap ${
                        activeTab === "past"
                          ? "text-white "
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full inline-block transition-colors ${
                          activeTab === "past" ? "bg-[#FF6A50]" : "bg-[#04050F]"
                        }`}
                      />
                      <p>Past Events</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider
              <hr className="border-white/10 mb-4" /> */}

              {/* Event list */}
              <div className="flex border-x border-b p-4 border-white/10 flex-col gap-3">
                {displayedEvents.length === 0 ? (
                  <p className="text-white/40 text-sm py-6 text-center">
                    No {activeTab} events at the moment.
                  </p>
                ) : (
                  displayedEvents.map((item, index) => (
                    <div
                      key={index}
                      className="flex  items-center gap-4 p-2 border border-[#FF6A50] lg:border-[#04050F] lg:hover:border-[#FF6A50] transition-colors"
                    >
                      {/* Icon */}
                      <div className="hidden lg:block lg:w-30 xl:w-40 h-auto shrink-0  overflow-hidden bg-white/5">
                        <PrismicNextImage
                          field={item.icon}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Meta */}
                      <div className="flex flex-col  flex-1 min-w-0">
                        <span className="text-white/50 text-xs lg:text-sm xl:text-base mb-1 font-mono font-normal tracking-wide">
                          <PrismicRichText field={item.location} />
                        </span>
                        <span className="text-white font-medium text-sm lg:text-xl xl:text-2xl  leading-tight">
                          <PrismicRichText field={item.title} />
                        </span>
                        <span className="text-white/50  text-[10px] lg:text-base xl:text-lg mt-0.5">
                          <PrismicRichText field={item.date} />
                        </span>
                        <div className="md:hidden mt-3 ">
                          {item.cta_button && (
                            <EventCTA innerClassName="text-sm!" link={item.cta_button} />
                          )}
                        </div>
                      </div>

                      {/* CTA */}
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
