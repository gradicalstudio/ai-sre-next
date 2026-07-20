"use client";
import HeroButton from "@/components/HeroButton";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import MarqueeLib from "react-fast-marquee";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @typedef {import("@prismicio/client").Content.MarqueeSlice} MarqueeSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<MarqueeSlice>} MarqueeProps
 * @type {import("react").FC<MarqueeProps>}
 */
const Marquee = ({ slice }) => {
  const headingRef = useRef(null);
  const marqueeRef = useRef(null);
  const spanWordRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      (tl
        .fromTo(
          headingRef.current,
          { opacity: 0, filter: "blur(6px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
          },
        )
        .to(spanWordRef.current, { opacity: 1, duration: 0.4 })

        .to(marqueeRef.current, { opacity: 1 }),
        "-=1");
    });
    return () => ctx.revert();
  }, []);
  return (
    <section
      id="logo-marquee"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45 bg-[#04050F]"
    >
      <div
        ref={headingRef}
        className="text-white text-center text-[16px] leading-7 md:text-xl lg:text-2xl 4xl:text-[44px]"
      >
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            strong: ({ children }) => (
              <strong
                ref={spanWordRef}
                className="font-mono opacity-0 font-medium text-white not-italic"
              >
                <span className="bg-linear-to-b from-[#FF6A50] to-[#40D9FA] inline bg-black py-1.75 px-px md:py-2 4xl:px-0.5 ">
                  <span className="  ">
                    <span className="bg-[#04050F] py-1.5 md:py-1.75 px-0.75 4xl:px-2 ">
                      {children}
                    </span>
                  </span>
                </span>
              </strong>
            ),
          }}
        />
      </div>
      {/* Marquee */}
      <div ref={marqueeRef} className="mt-7 opacity-0 2xl:mt-10">
        <MarqueeLib speed={120} gradient={false}>
          {slice.primary.marquee.map((item, index) => (
            <div key={index} className="mx-4">
              <PrismicNextImage field={item.logo} className="h-6 w-auto" />
            </div>
          ))}
        </MarqueeLib>
      </div>
    </section>
  );
};

export default Marquee;
