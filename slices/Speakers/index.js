"use client";

import { useEffect, useRef } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Bounded from "@/components/Bounded";
import SpeakerSlider from "@/components/SpeakerSlider";

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {import("@prismicio/client").Content.SpeakersOfBangaloreEditionSlice} SpeakersOfBangaloreEditionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<SpeakersOfBangaloreEditionSlice>} SpeakersOfBangaloreEditionProps
 * @type {import("react").FC<SpeakersOfBangaloreEditionProps>}
 */
const SpeakersOfBangaloreEdition = ({ slice }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const sliderRef = useRef(null);
  const showSlice =
    slice.variation === "secondaryVar"
      ? Boolean(slice?.primary?.show_slice)
      : true;
  useEffect(() => {
    if (!showSlice || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 767;
      if (slice.variation === "default") {
        // Heading

        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 80, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: isMobile ? "-400px 99%" : "top 75%",
              once: true,
            },
          },
        );

        // LEFT SVG
        gsap.fromTo(
          ".left-pattern",
          { scaleX: 0, opacity: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            opacity: 0.6,
            duration: 1.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );

        // RIGHT SVG
        gsap.fromTo(
          ".right-pattern",
          { scaleX: 0, opacity: 0, transformOrigin: "right center" },
          {
            scaleX: 1,
            opacity: 0.6,
            duration: 1.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );

        // Cards
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 120, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            },
          );
        });
      }

      if (slice.variation === "secondaryVar") {
        // Heading

        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 80, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: isMobile ? "top 90%" : "top 85%",
              once: true,
            },
          },
        );
        gsap.fromTo(
          sliderRef.current,
          { opacity: 0, y: 80, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sliderRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
        // Cards
        cardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 120, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 85%", once: true },
            },
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [slice.variation, showSlice]);
  if (!showSlice) {
    return null;
  }
  return (
    <>
      {slice.variation === "default" && (
        <section
          ref={sectionRef}
          id="speakers"
          data-slice-type={slice.slice_type}
          data-slice-variation={slice.variation}
          className="relative   mx-auto w-full
          max-w-250
          2xl:max-w-330
          px-6 md:px-6 lg:px-8
          py-10 md:py-14 lg:py-30 mt-0 lg:-mt-40 xl:mb-15  overflow-hidden  text-white"
        >
          {/* LEFT SVG */}

          <img
            src="/Mask group.svg"
            alt=""
            className=" 
    hidden lg:block
    left-pattern
    pointer-events-none absolute opacity-60
    left-0 top-0 w-65
    md:-left-22.5 md:-top-2.5 md:w-105
    lg:left-15 lg:top-18.75 lg:w-155
    xl:left-0 xl:top-25 xl:w-155
  "
          />

          {/* RIGHT SVG */}

          <img
            src="/Mask group (1).svg"
            alt=""
            className="
    right-pattern
    hidden lg:block
    pointer-events-none absolute opacity-60
    right-15 top-2.5 w-65
    md:-right-55 md:-top-5 md:w-105
    lg:-right-47.5 lg:top-20 lg:w-155
    xl:right-0 xl:top-25 xl:w-130
  "
          />

          <div className="relative z-10 ">
            {/* HEADING */}

            <div
              ref={headingRef}
              className="
            mb-14 flex items-center justify-center gap-4
            md:mb-20 md:gap-6
            lg:mb-24 lg:gap-8
          "
            >
              {/* LEFT ICON */}

              <img
                src="/speakers.svg"
                alt=""
                className="
              w-11.25
              shrink-0

              md:w-17.5

              lg:w-22.5
            "
              />

              {/* HEADING TEXT */}

              <div
                className="
              max-w-[320px]
              text-left text-3xl leading-none

              md:max-w-125
              md:text-[34px]
              lg:text-[40px]
            "
              >
                <PrismicRichText field={slice.primary.heading} />
              </div>
            </div>

            {/* SPEAKERS */}

            <div
              className=" 
            flex flex-wrap items-start justify-center
            gap-x-8 gap-y-14
            md:gap-x-10 md:gap-y-16
          
          "
            >
              {slice.primary.speaker.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="
                group relative
              w-40
md:w-55
lg:w-50
              "
                >
                  {/* IMAGE */}

                  <div
                    className="
                  relative overflow-hidden rounded-full
                  mt-0 h-40 w-40
md:mt-8 md:h-46.5 md:w-46.5
lg:mt-20 
                "
                  >
                    <PrismicNextImage
                      field={item.speaker_image}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="mt-4 md:mt-6 lg:mt-8">
                    {/* NAME */}

                    <h3
                      className="
                    text-base font-medium leading-none text-white
                    md:text-[15px]
                    lg:text-[18px]
                  "
                    >
                      {item.name}
                    </h3>

                    {/* ROLE */}
                    {item.role && (
                      <p
                        className="
    mt-2 text-sm leading-none text-[#8B90A7]
    md:text-base
    lg:mt-3 lg:text-[16px]
  "
                      >
                        {item.role}
                      </p>
                    )}

                    {/* LINKEDIN */}
                    {item.linkedin?.url && (
                      <PrismicNextLink
                        field={item.linkedin}
                        className="
      mt-4 inline-flex
      transition-all duration-300
      hover:scale-110 hover:opacity-80
      lg:mt-6
    "
                      >
                        <img
                          src="/Linkden.svg"
                          alt="LinkedIn"
                          className="
        h-5 w-5
        md:h-6 md:w-6
        lg:h-7 lg:w-7
      "
                        />
                      </PrismicNextLink>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {slice.variation === "secondaryVar" && (
        <section id="speakers" ref={sectionRef} className="px-4 ">
          <div className="flex items-center 2xl:max-w-360 mx-auto  w-full select-none px-2">
            <div className="w-full flex items-center gap-2 md:gap-6 2xl:gap-15 xl:mb-17">
              <div className="flex-1 hidden md:block">
                <img
                  className=" h-full object-cover"
                  src="/Left side circuit.svg"
                />
              </div>
              <div className="text-white text-pretty">
                <div ref={headingRef} className="flex flex-2 gap-3">
                  <img className="w-7 md:w-9 xl:w-11" src="/speakers.svg" />
                  <div className="leading-[1.1] text-3xl  md:text-[34px] lg:text-[36px] xl:text-[40px] font-medium">
                    <PrismicRichText field={slice.primary.heading} />
                  </div>
                </div>
              </div>
              <div className="flex-2  hidden md:block">
                <img
                  className="w-full h-full md:object-contain"
                  src="/right new.svg"
                />
              </div>
            </div>
          </div>
          <div ref={sliderRef} className="md:hidden pb-20">
            <SpeakerSlider speakers={slice.primary.speaker} />
          </div>
          <Bounded className=" hidden md:block text-white mt-17">
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 w-fit mx-auto gap-20">
              {slice.primary.speaker.map((item, index) => (
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  key={index}
                  className="flex  max-w-60 md:max-w-full  flex-col  text-left gap-3"
                >
                  <div
                    className=" group
    h-41
    w-41
    rounded-full
    bg-transparent
    p-0.5
    transition-all
    duration-300
    hover:bg-linear-to-b
    hover:from-[#FA6D55]
    hover:to-[#3FD9FB]
  "
                  >
                    <div className="overflow-hidden rounded-full h-full w-full">
                      <PrismicNextImage
                        field={item.speaker_image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="self-start">
                    <div>
                      <div className="font-medium  text-base md:text-sm lg:text-base xl:text-lg">
                        <PrismicRichText field={item.name_rich_text} />
                      </div>
                      <div className=" text-sm md:text-[15px] xl:text-base text-gray-400">
                        <PrismicRichText field={item.role_rich_text} />
                      </div>
                    </div>

                    {item.linkedin?.url && (
                      <div className="flex mt-2 items-center gap-2">
                        <PrismicNextLink field={item.linkedin}>
                          <img src="/Linkden.svg" className="w-5 h-5" />
                        </PrismicNextLink>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Bounded>
        </section>
      )}
    </>
  );
};

export default SpeakersOfBangaloreEdition;
