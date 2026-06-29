"use client";

import { useEffect, useRef, useState } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "react-fast-marquee";

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {import("@prismicio/client").Content.ParticipantsSlice} ParticipantsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ParticipantsSlice>} ParticipantsProps
 * @type {import("react").FC<ParticipantsProps>}
 */
const Participants = ({ slice }) => {
  const [isMobile, setIsMobile] = useState(false);
  const showSlice = slice?.primary?.show_slice ?? true;

  const sectionRef = useRef(null);
  const cellsRef = useRef([]);

  cellsRef.current = [];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    setIsMobile(media.matches);

    const listener = (e) => setIsMobile(e.matches);

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!showSlice) return;
    const ctx = gsap.context(() => {
      const cells = cellsRef.current.filter(Boolean);

      gsap.set(cells, {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });

      tl.to(cells, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
      });

      // Desktop shimmer only
      if (!isMobile) {
        cells.forEach((cell, index) => {
          if (!cell || index === 0) return;

          cell.style.position = "relative";

          cell.style.overflow = "hidden";

          const reflection = document.createElement("div");

          reflection.className = `
            absolute
            top-[-40%]
            left-[-150%]

            h-[240%]
            w-[45%]

            rotate-[25deg]

            bg-gradient-to-r
            from-transparent
            via-white/25
            to-transparent

            blur-md

            pointer-events-none

            opacity-0
          `;

          cell.appendChild(reflection);

          const animate = () => {
            gsap.fromTo(
              reflection,
              {
                x: 0,
                opacity: 0,
              },
              {
                x: cell.offsetWidth * 3,

                opacity: 1,

                duration: 1.3,

                ease: "power2.inOut",

                onComplete: () => {
                  gsap.set(reflection, {
                    x: 0,
                    opacity: 0,
                  });

                  gsap.delayedCall(Math.random() * 6 + 2, animate);
                },
              },
            );
          };

          gsap.delayedCall(1 + Math.random() * 2, animate);
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, showSlice]);

  if (!showSlice) {
    return null;
  }

  const companies = slice.primary.companies || [];

  const useMobileMarquee = isMobile && companies.length > 3;

  const Logo = ({ item }) =>
    item.link?.url ? (
      <PrismicNextLink
        field={item.link}
        className="
          flex
          items-center
          justify-center
          w-full
          h-full
        "
      >
        <PrismicNextImage
          field={item.logo}
          className="
            max-h-[40px]
            max-w-[180px]

            w-auto
            h-auto

            object-contain
          "
        />
      </PrismicNextLink>
    ) : (
      <PrismicNextImage
        field={item.logo}
        className="
          md:max-h-[40px]
          md:max-w-[180px]

          md:w-auto
          md:h-auto
          max-h-[40px]
  h-[30px]
  w-full
  max-w-[300px]
  object-center
          md:object-contain
        "
      />
    );

  return (
    <section
      className="
        bg-[#04050F]
        mx-auto
        w-full
      overflow-hidden mx-auto w-full max-w-[1000px] xl:max-w-[1280px] 2xl:max-w-[1440px] px-6 md:px-14
        my-13
        md:my-20
        md:pb-[15px]
        xl:my-20

      "
    >
      <section
        className="
          bg-[#04050F]
          overflow-hidden
        "
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <div ref={sectionRef} className="relative">
          <div className="border border-white/20">
            <div className="flex flex-wrap">
              {/* TITLE */}

              <div
                ref={(el) => {
                  if (el) cellsRef.current.push(el);
                }}
                className="
                  font-mono
                  flex
                  flex-[1_1_25%]

                  min-w-[220px]

                  min-h-[90px]
                  md:min-h-[110px]

                  items-center
                  justify-center

                  border-b
                  border-r
                  border-white/20

                  px-4
                "
              >
                <h2 className="md:hidden text-left uppercase text-[#ff5c35] text-[16px] leading-[1.3] tracking-[0.22em] md:text-[16px]">
                  Companies Participated
                </h2>

                <h2 className="hidden md:block text-left uppercase text-[#ff5c35] text-[15px] leading-[1.3] tracking-[0.22em] md:text-[16px]">
                  Companies
                  <br />
                  Participated
                </h2>
              </div>

              {useMobileMarquee ? (
                <div
                  className="
                    w-full
                    overflow-hidden
                    py-4
                  "
                >
                  <Marquee speed={65} gradient={false}>
                    {companies.map((item, index) => (
                      <div
                        key={index}
                        className="
                            flex
                    
                            items-center
                            justify-center

                            md:w-[180px]
                            md:h-[40px]
h-[42px]
w-[auto]
          px-6
                            shrink-0
                            
                          "
                      >
                        <Logo item={item} />
                      </div>
                    ))}
                  </Marquee>
                </div>
              ) : (
                <>
                  {companies.map((item, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (el) cellsRef.current.push(el);
                      }}
                      className="
                          flex
                          flex-[1_1_25%]

                          min-w-[220px]

                          min-h-[90px]
                          md:min-h-[110px]

                          items-center
                          justify-center

                          border-r
                          border-b
                          border-white/20

                          px-6
                        "
                    >
                      <Logo item={item} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <img
            src="/Rectangle 574056928.svg"
            alt=""
            className="absolute top-0 left-0 -rotate-90"
          />

          <img
            src="/Rectangle 574056928.svg"
            alt=""
            className="absolute top-0 right-0"
          />

          <img
            src="/Rectangle 574056928.svg"
            alt=""
            className="absolute bottom-0 right-0 rotate-90"
          />

          <img
            src="/Rectangle 574056928.svg"
            alt=""
            className="absolute bottom-0 left-0 rotate-180"
          />
        </div>
      </section>
    </section>
  );
};

export default Participants;
