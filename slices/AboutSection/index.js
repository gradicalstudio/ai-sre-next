"use client";

import { useRef, useEffect } from "react";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @typedef {import("@prismicio/client").Content.AboutSectionSlice} AboutSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AboutSectionSlice>} AboutSectionProps
 * @type {import("react").FC<AboutSectionProps>}
 */
const AboutSection = ({ slice }) => {
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = [];

  const addCardRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headingRef.current, ...cardsRef.current], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      const tlTwo = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        },
      );

      tlTwo.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power3.out",
          stagger: 0.15,
        },
      );
    });

    return () => ctx.revert();
  }, []);
  return (
    // Main Container
    <section
      id="about"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 md:px-6 lg:px-9 mb-22.5 md:mb-45"
    >
      {/* Inner Container */}
      <div className="lg:px-15 xl:px-24 2xl:px-30 4xl:px-33.25">
        {/* Top */}
        <div
          ref={headingRef}
          className="text-base md:text-[26px] lg:text-[28px] xl:text-[34px] 2xl:text-[36px] 4xl:text-[44px] text-white opacity-0 md:leading-[1.1] lg:leading-none lg:w-[84%] xl:w-[84%] 2xl:w-[84%] 4xl:w-[84%] mb-12.5 md:mb-27 lg:mb-27 xl:mb-35  2xl:mb-45"
        >
          <PrismicRichText field={slice.primary.intro_text} />
        </div>
        {/* Bottom */}
        <div>
          {/* Cards */}
          <div className="  text-white flex flex-col md:flex-row gap-6 md:gap-15 lg:gap-15 2xl:gap-24 4xl:gap-30 ">
            {slice.primary.overview_cards.map((item, i) => (
              <div
                key={i}
                ref={addCardRef}
                className="  md:w-95 lg:w-100 xl:w-115 2xl:w-113 4xl:w-120"
              >
                <div>
                  <div className="mb-3 md:mb-6 lg:mb-7.5 2xl:mb-9.5 h-auto w-20 md:w-20 lg:w-25 xl:w-30 ">
                    <PrismicNextImage field={item.icon} className="" />
                  </div>
                  <div className="text-xl lg:text-[22px] xl:text-[26px] 4xl:text-[28px]">
                    <PrismicRichText field={item.title} />
                  </div>
                  <div className=" mt-3 lg:mt-4 text-sm md:text-xs md:tracking-wide lg:text-sm 4xl:text-base text-[#A2A2A2] text-pretty ">
                    <PrismicRichText field={item.description} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
