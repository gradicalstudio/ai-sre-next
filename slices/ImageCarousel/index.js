"use client";

import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicNextImage } from "@prismicio/next";

gsap.registerPlugin(ScrollTrigger);

/**
 * @typedef {import("@prismicio/client").Content.ImageCarouselSlice} ImageCarouselSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ImageCarouselSlice>} ImageCarouselProps
 * @type {import("react").FC<ImageCarouselProps>}
 */
const ImageCarousel = ({ slice }) => {
  const autoScrollPlugin = AutoScroll({
    speed: 2,
    startDelay: 0,
    stopOnInteraction: false,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: "start",
    },
    [autoScrollPlugin],
  );

  const sectionRef = useRef(null);

  // Speed the carousel up while the user scrolls (either direction) with it in view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!emblaApi || !section) return;

    const MAX_BOOST = 14; // extra px per frame on top of the base speed
    const SENSITIVITY = 0.6; // scroll px per frame -> boost
    let inView = false;
    let refreshing = false;
    let target = 0;
    let boost = 0;

    // ScrollTrigger.refresh() resets/restores scroll, which isn't real user
    // scrolling, so don't boost for it.
    const onRefreshInit = () => {
      refreshing = true;
      target = 0;
    };
    const onRefresh = () => {
      refreshing = false;
    };
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        inView = self.isActive;
        if (!inView) target = 0;
      },
      onUpdate: (self) => {
        if (refreshing || !inView) return;
        const perFrame = (Math.abs(self.getVelocity()) / 60) * SENSITIVITY;
        target = Math.min(MAX_BOOST, Math.max(target, perFrame));
      },
    });

    const tick = () => {
      // Per-frame steps on purpose: Embla's auto-scroll also moves a fixed
      // amount per frame, so on a slow frame both slow down together instead
      // of the boost jumping ahead of the base motion.
      target *= 0.92; // decays once scrolling stops
      boost += (target - boost) * 0.15; // ease in/out
      if (boost < 0.01) boost = 0;

      const autoScroll = emblaApi.plugins()?.autoScroll;
      if (boost > 0 && autoScroll?.isPlaying()) {
        const { location, target: scrollTarget } = emblaApi.internalEngine();
        location.add(-boost);
        scrollTarget.set(location);
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, [emblaApi]);

  const onPointerUp = () => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;
    autoScroll.play();
  };

  return (
    <section
      ref={sectionRef}
      id="image-carousel"
      className="max-w-[1920px] mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45 bg-[#04050F]"
    >
      <div
        className="  overflow-hidden select-none"
        ref={emblaRef}
        onPointerUp={onPointerUp}
      >
        <div className="flex">
          {slice.primary.carousel_image.map((item, index) => (
            <div
              key={index}
              className="flex-none  w-[60%] md:w-[30%] xl:w-[23%] pr-4"
            >
              <div className="relative bg-[#222433] w-full h-50 md:h-55 lg:h-70 xl:h-80 2xl:h-90 4xl:h-100">
                <PrismicNextImage
                  field={item.image}
                  fill
                  preload={index < 3}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 30vw, 23vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
