"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PrismicNextImage } from "@prismicio/next";
import ImageLightbox from "@/components/ImageLightbox";

gsap.registerPlugin(ScrollTrigger);

// Auto-scroll speed in px per frame.
const AUTO_SCROLL_SPEED = 2;

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
    speed: AUTO_SCROLL_SPEED,
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

  // After a drag, resume auto-scroll once the glide has slowed to auto-scroll
  // speed. The plugin itself waits for Embla's `settle`, which on a free-drag
  // glide comes ~3s after the carousel has visibly stopped.
  const resumeAfterDragRef = useRef(false);
  // Embla's pointerUp (on mouseup) fires after the tile's pointerup has
  // already opened the modal, so it checks this before arming the resume.
  const lightboxOpenRef = useRef(false);
  // True while a mouse is over the carousel: auto-scroll stays paused.
  const hoverRef = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    const onPointerDown = () => {
      resumeAfterDragRef.current = false;
    };
    const onPointerUp = () => {
      resumeAfterDragRef.current = !lightboxOpenRef.current;
    };
    const onScroll = () => {
      if (!resumeAfterDragRef.current) return;
      const velocity = emblaApi.internalEngine().scrollBody.velocity();
      if (Math.abs(velocity) > AUTO_SCROLL_SPEED) return;
      // Glide is done; resume now unless hovered (then on pointer leave).
      resumeAfterDragRef.current = false;
      if (!hoverRef.current) autoScroll?.play();
    };
    // The plugin also restarts itself (when a glide settles, or on slide
    // focusout). Veto that while hovered or while the modal is open. It
    // announces play before it becomes active, so stop on the next microtask.
    const onPlay = () => {
      if (hoverRef.current || lightboxOpenRef.current) {
        queueMicrotask(() => autoScroll?.stop());
      }
    };
    emblaApi
      .on("pointerDown", onPointerDown)
      .on("pointerUp", onPointerUp)
      .on("scroll", onScroll)
      .on("autoScroll:play", onPlay);
    return () => {
      emblaApi
        .off("pointerDown", onPointerDown)
        .off("pointerUp", onPointerUp)
        .off("scroll", onScroll)
        .off("autoScroll:play", onPlay);
    };
  }, [emblaApi]);

  // Pause on mouse hover. Not the plugin's stopOnMouseEnter: that restarts
  // auto-scroll on mouseleave even mid-drag, which overrides the drag.
  const onCarouselPointerEnter = (e) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = true;
    emblaApi?.plugins()?.autoScroll?.stop();
  };

  const onCarouselPointerLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = false;
    if (lightboxOpenRef.current) return;
    // Mid-drag or mid-glide: the drag-release logic above resumes it.
    if (emblaApi?.internalEngine().dragHandler.pointerDown()) return;
    if (resumeAfterDragRef.current) return;
    emblaApi?.plugins()?.autoScroll?.play();
  };

  // Index (into shuffledImages) of the photo open in the lightbox, or null.
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => {
    lightboxOpenRef.current = true;
    resumeAfterDragRef.current = false;
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
    lightboxOpenRef.current = false;
    setLightboxIndex(null);
    // The modal covered the carousel, so the hover state is stale. If the
    // mouse is back over the carousel, stay paused.
    hoverRef.current = !!emblaApi?.rootNode().matches(":hover");
    if (!hoverRef.current) emblaApi?.plugins()?.autoScroll?.play();
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
        onPointerEnter={onCarouselPointerEnter}
        onPointerLeave={onCarouselPointerLeave}
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
                className="group/tile relative block bg-[#222433] w-full h-50 md:h-55 lg:h-70 xl:h-80 2xl:h-90 4xl:h-100 cursor-pointer"
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
                {/* "Expand" hint, shown instantly on hover / keyboard focus;
                    the arrows then nudge outward once. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="overflow-visible"
                  >
                    <g className="-translate-x-0.5 translate-y-0.5 transition-transform duration-200 ease-out group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 motion-reduce:translate-none motion-reduce:transition-none motion-reduce:group-hover/tile:translate-none">
                      <path d="M15 3h6v6" />
                      <path d="M21 3l-7 7" />
                    </g>
                    <g className="translate-x-0.5 -translate-y-0.5 transition-transform duration-200 ease-out group-hover/tile:-translate-x-0.5 group-hover/tile:translate-y-0.5 motion-reduce:translate-none motion-reduce:transition-none motion-reduce:group-hover/tile:translate-none">
                      <path d="M9 21H3v-6" />
                      <path d="M3 21l7-7" />
                    </g>
                  </svg>
                </span>
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
