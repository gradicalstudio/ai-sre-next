"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicNextImage } from "@prismicio/next";
import ImageLightbox from "@/components/ImageLightbox";

gsap.registerPlugin(ScrollTrigger);

// Fisher-Yates, on a copy so the Prismic data isn't mutated.
const shuffle = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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

  // Shuffled after mount, not during render, so the server HTML and first
  // client render match. Slides show their placeholder background until then.
  const images = slice.primary.carousel_image;
  const [shuffledImages, setShuffledImages] = useState(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShuffledImages(shuffle(images));
    });
    return () => cancelAnimationFrame(frame);
  }, [images]);

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

  // Index (into shuffledImages) of the photo open in the lightbox, or null.
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => {
    emblaApi?.plugins()?.autoScroll?.stop();
    setLightboxIndex(index);
  };

  // A photo opens on press-and-release in the same spot, decided here rather
  // than by `click`: after a drag released outside the carousel, Embla
  // swallows the next click, which made the first click on a photo do nothing.
  const pressRef = useRef(null);

  const onTilePointerDown = (e, index) => {
    if (e.button !== 0) return;
    pressRef.current = { index, x: e.clientX, y: e.clientY };
  };

  const onTilePointerUp = (e, index) => {
    const press = pressRef.current;
    pressRef.current = null;
    if (!press || press.index !== index) return;
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) return;
    openLightbox(index);
  };

  // Pointer clicks are handled above; this covers Enter/Space (detail 0).
  const onTileClick = (e, index) => {
    if (e.detail === 0) openLightbox(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    emblaApi?.plugins()?.autoScroll?.play();
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      id="image-carousel"
      className="max-w-[1920px] mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45 bg-[#04050F]"
    >
      <div
        className="  overflow-hidden select-none"
        ref={emblaRef}
      >
        <div className="flex">
          {(shuffledImages ?? images).map((item, index) => (
            <div
              key={index}
              className="flex-none  w-[60%] md:w-[30%] xl:w-[23%] pr-4"
            >
              <button
                type="button"
                // Keep a mouse press from moving focus between tiles: the
                // AutoScroll plugin restarts on `focusout` from a slide, which
                // overrode the drag whenever a press landed on another tile.
                onMouseDown={(e) => e.preventDefault()}
                onPointerDown={(e) => onTilePointerDown(e, index)}
                onPointerUp={(e) => onTilePointerUp(e, index)}
                onPointerCancel={() => (pressRef.current = null)}
                onClick={(e) => onTileClick(e, index)}
                disabled={!shuffledImages}
                aria-label={`Open photo ${index + 1} of ${images.length}`}
                className="relative block bg-[#222433] w-full h-50 md:h-55 lg:h-70 xl:h-80 2xl:h-90 4xl:h-100 cursor-pointer"
              >
                {shuffledImages && (
                  <PrismicNextImage
                    field={item.image}
                    fill
                    preload={index < 3}
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 30vw, 23vw"
                    className="object-cover"
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={shuffledImages}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </section>
  );
};

export default ImageCarousel;
