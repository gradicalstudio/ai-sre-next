"use client";
import { useEffect, useRef } from "react";
import ArrowDown from "@/components/ArrowDownIcon";
import HeroButton from "@/components/HeroButton";
import { PrismicRichText } from "@prismicio/react";
import gsap from "gsap";

/**
 * @typedef {import("@prismicio/client").Content.HeroSectionSlice} HeroSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeroSectionSlice>} HeroSectionProps
 * @type {import("react").FC<HeroSectionProps>}
 */
const HeroSection = ({ slice }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const iframeWrapRef = useRef(null);
  const subtextRef = useRef(null);
  const subtextTwoRef = useRef(null);
  const arrowRef = useRef(null);
  const arrowTwoRef = useRef(null);
  const mobDivRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const entranceTargets = [
      headingRef.current,
      descriptionRef.current,
      iframeWrapRef.current,
      subtextRef.current,
      subtextTwoRef.current,
      mobDivRef.current,
    ];

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(entranceTargets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }

      gsap.set(entranceTargets, {
        willChange: "filter, transform, opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          gsap.set(entranceTargets, { willChange: "auto" });
        },
      });

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 80, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
      )
        .fromTo(
          descriptionRef.current,
          { opacity: 0, y: 80, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.55",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, filter: "blur(10px)", y: 80 },

          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.9,
          },
          "<",
        )
        .fromTo(
          iframeWrapRef.current,
          { filter: "blur(5px)" },
          { opacity: 1, filter: "blur(0px)", duration: 0.9 },
          "-=0.35",
        )
        .fromTo(
          [subtextRef.current, subtextTwoRef.current, mobDivRef.current],
          { opacity: 0, y: -20, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 },
          "-=0.10",
        );

      gsap.to(arrowRef.current, {
        y: 10,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(arrowTwoRef.current, {
        y: 6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const isScrollingRef = useRef(false);

  const handleScrollDown = () => {
    if (isScrollingRef.current) return;
    const next = sectionRef.current?.nextElementSibling;
    if (!next) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const headerOffset =
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const targetTop =
      next.getBoundingClientRect().top + window.scrollY - headerOffset;

    isScrollingRef.current = true;
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if ("onscrollend" in window) {
      window.addEventListener(
        "scrollend",
        () => {
          isScrollingRef.current = false;
        },
        { once: true },
      );
    } else {
      setTimeout(
        () => {
          isScrollingRef.current = false;
        },
        prefersReducedMotion ? 100 : 700,
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45 bg-[#04050F] "
    >
      {/* Main container */}
      <div className=" w-full h-full">
        {/* iframe container — decorative background embed, hidden from AT */}
        <div
          ref={iframeWrapRef}
          className="w-full opacity-0 mb-10 xl:mb-12 2xl:mb-19.5 h-30 md:h-55 lg:h-50 2xl:h-55 4xl:h-75 "
        >
          <iframe
            src="https://www.unicorn.studio/embed/2wYzUuTwklWbYOVWOlkR"
            title=""
            aria-hidden="true"
            tabIndex={-1}
            className="w-full h-full  "
            allowFullScreen
          />
        </div>
        {/* Contents */}
        <div className="text-white flex flex-col lg:flex-row lg:gap-25 xl:gap-50 2xl:gap-49 4xl:gap-58 ">
          {/* left */}
          <div className="md:w-[70%] lg:w-[60%] xl:w-[40%]   2xl:w-[59%] 4xl:w-[58%] flex flex-col lg:gap-25 justify-between mb-5 md:mb-7 lg:mb-0">
            <div
              ref={headingRef}
              className="text-[2.375rem] md:text-6xl lg:text-[56px] 2xl:text-[86px] opacity-0 4xl:text-[6.375rem] leading-none lg:leading-[0.9] "
            >
              <PrismicRichText field={slice.primary.heading} />
            </div>
            <div
              ref={subtextRef}
              className=" hidden lg:block opacity-0 uppercase font-mono text-[#3ED4F5]"
            >
              <p>AI SRE Community by StackGen</p>
            </div>
          </div>
          {/* right */}
          <div className="flex lg:w-[49%]  flex-col 4xl:gap-35 justify-between">
            <div className="flex flex-col lg:gap-8 xl:gap-14">
              <div
                ref={descriptionRef}
                className="md:w-[60%] opacity-0 lg:w-[85%] xl:w-[83%] 4xl:w-[80%] mb-5 md:mb-7 lg:mb-0 text-sm md:text-base lg:text-lg 4xl:text-xl"
              >
                <PrismicRichText field={slice.primary.description} />
              </div>
              <div className="opacity-0" ref={ctaRef}>
                <HeroButton link={slice.primary.cta_button} />
              </div>
            </div>
            <div
              ref={subtextTwoRef}
              className="hidden opacity-0 lg:mt-10 xl:mt-20 lg:flex justify-between font-mono text-[#3ED4F5] items-center uppercase"
            >
              <p>Scroll down</p>
              <button
                type="button"
                onClick={handleScrollDown}
                aria-label="Scroll to next section"
                className="p-2.5 -m-2.5 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ED4F5] touch-manipulation"
              >
                <div ref={arrowRef}>
                  <span aria-hidden="true">
                    <ArrowDown />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Filler  */}
        <div
          ref={mobDivRef}
          className=" mt-5 opacity-0 md:mt-7 lg:hidden flex text-xs font-mono items-center justify-between w-full "
        >
          <div className="  uppercase font-mono  text-[#3ED4F5]">
            <p>AI SRE Community by StackGen</p>
          </div>
          <button
            type="button"
            onClick={handleScrollDown}
            aria-label="Scroll to next section"
            className="flex gap-2 font-mono text-[#3ED4F5] items-center uppercase p-2.5 -m-2.5 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ED4F5] touch-manipulation"
          >
            <p>Scroll down</p>
            <div className="-mt-1 md:-mt-2" ref={arrowTwoRef}>
              <span aria-hidden="true">
                <ArrowDown />
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
