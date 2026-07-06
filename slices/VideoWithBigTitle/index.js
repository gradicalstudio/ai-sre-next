"use client";
import WistiaPlayer from "@/components/WistiaPlayer";
import { PrismicRichText } from "@prismicio/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @typedef {import("@prismicio/client").Content.VideoWithBigTitleSlice} VideoWithBigTitleSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<VideoWithBigTitleSlice>} VideoWithBigTitleProps
 * @type {import("react").FC<VideoWithBigTitleProps>}
 */
const VideoWithBigTitle = ({ slice }) => {
  const previewVideoUrl = slice.primary.preview_video?.url ?? null;
  const headingRef = useRef(null);
  const iconRef = useRef(null);
  const videoContainerRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
            // markers: true,
          },
        });

        if (isDesktop) {
          tl.fromTo(
            headingRef.current,
            { opacity: 0, y: 20, filter: "blur(10px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          )
            .fromTo(
              [videoContainerRef.current, descriptionRef.current],
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1 },
              "-=0.3",
            )
            .fromTo(
              iconRef.current,
              { opacity: 0, filter: "blur(10px)" },
              { opacity: 1, filter: "blur(0px)" },
              "<",
            );
        } else {
          tl.fromTo(
            iconRef.current,
            { opacity: 0, filter: "blur(10px)" },
            { opacity: 1, filter: "blur(0px)", duration: 0.4 },
          )
            .fromTo(
              headingRef.current,
              { opacity: 0, y: 20, filter: "blur(10px)" },
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 },
            )
            .fromTo(
              [videoContainerRef.current, descriptionRef.current],
              { x: 30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
            );
        }

        return () => tl.scrollTrigger?.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] overflow-hidden mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45"
    >
      {/* Inner Container */}
      <div className="lg:px-15 xl:px-24 2xl:px-30 4xl:px-33.25 flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-30">
        {/* Left */}
        <div className="flex flex-col-reverse lg:flex-col justify-between lg:w-[50%] 2xl:w-[52%] 4xl:w-[52%]  ">
          <div
            ref={headingRef}
            className="text-white opacity-0 font-medium text-xl md:text-4xl 2xl:text-[60px] w-[80%] md:w-[65%] lg:w-full xl:w-[70%] 2xl:w-[90%] 4xl:w-[65%] leading-[1.1]"
          >
            <PrismicRichText field={slice.primary.heading} />
          </div>
          <div ref={iconRef} className="mb-5 opacity-0 md:mb-7 lg:mb-0">
            <img
              className="w-20 md:w-25 lg:w-30 xl:w-35 h-auto"
              src="./devOps.png"
            />
          </div>
        </div>
        {/* Right */}
        <div className="lg:w-[40%]">
          {/* Video Player */}
          <div
            ref={videoContainerRef}
            className="opacity-0 2xl:w-125.25 mb-8.5"
          >
            <WistiaPlayer
              wistiaUrl={slice.primary.video_link.url}
              previewSrc={previewVideoUrl}
              // posterSrc={doc.data.preview_poster?.url}
            />
          </div>
          <div
            ref={descriptionRef}
            className="2xl:w-145 opacity-0 text-sm md:text-lg lg:text-sm 2xl:text-xl text-white"
          >
            <PrismicRichText field={slice.primary.short_description} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoWithBigTitle;
