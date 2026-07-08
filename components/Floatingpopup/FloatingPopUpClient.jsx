"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import useEmblaCarousel from "embla-carousel-react";
import gsap from "gsap";
import { ChevronIcon } from "./Chevronicon";

const SCROLL_TRIGGER_PX = 200;

export default function FloatingPopupClient({ popups }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const footerEl = document.querySelector("#site-footer");

    let ticking = false;
    const checkScroll = () => {
      setIsPastHero(window.scrollY >= SCROLL_TRIGGER_PX);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(checkScroll);
    };

    checkScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footerObserver = footerEl
      ? new IntersectionObserver(
          ([entry]) => setIsNearFooter(entry.isIntersecting),
          { rootMargin: "0px 0px -100px 0px" },
        )
      : null;

    footerObserver?.observe(footerEl);

    return () => {
      window.removeEventListener("scroll", onScroll);
      footerObserver?.disconnect();
    };
  }, []);

  if (isDismissed) return null;

  const commonProps = {
    onDismiss: () => setIsDismissed(true),
    isHidden: !isPastHero || isNearFooter,
    popups,
  };

  return (
    <>
      <div className="hidden lg:contents">
        <DesktopVariant {...commonProps} />
      </div>
      <div className="contents lg:hidden">
        <MobileVariant {...commonProps} />
      </div>
    </>
  );
}

function DesktopVariant({ popups, onDismiss, isHidden }) {
  return popups.length === 1 ? (
    <SinglePopup item={popups[0]} onDismiss={onDismiss} isHidden={isHidden} />
  ) : (
    <PopupSlider items={popups} onDismiss={onDismiss} isHidden={isHidden} />
  );
}

function MobileVariant({ popups, onDismiss, isHidden }) {
  return popups.length === 1 ? (
    <MobileSinglePopup
      item={popups[0]}
      onDismiss={onDismiss}
      isHidden={isHidden}
    />
  ) : (
    <MobilePopupSlider
      items={popups}
      onDismiss={onDismiss}
      isHidden={isHidden}
    />
  );
}

/* ---------------------------------- */
/* Shared: GSAP-driven show/hide        */
/* ---------------------------------- */

function usePopupVisibility(isHidden) {
  const wrapperRef = useRef(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!hasMounted.current) {
      gsap.set(el, {
        opacity: isHidden ? 0 : 1,
        y: isHidden ? 16 : 0,
        pointerEvents: isHidden ? "none" : "auto",
      });
      hasMounted.current = true;
      return;
    }

    if (prefersReducedMotion) {
      gsap.set(el, {
        opacity: isHidden ? 0 : 1,
        y: isHidden ? 16 : 0,
        pointerEvents: isHidden ? "none" : "auto",
      });
      return;
    }

    gsap.to(el, {
      opacity: isHidden ? 0 : 1,
      y: isHidden ? 16 : 0,
      duration: 0.9,
      ease: isHidden ? "power4.out" : "power4.out", 
      overwrite: "auto",
      onStart: () => {
        if (!isHidden) gsap.set(el, { pointerEvents: "auto" });
      },
      onComplete: () => {
        if (isHidden) gsap.set(el, { pointerEvents: "none" });
      },
    });
  }, [isHidden]);

  return wrapperRef;
}

/* ==================================== */
/* Desktop                              */
/* ==================================== */

function CloseButton({ onDismiss }) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss"
      style={{ touchAction: "manipulation" }}
      className="absolute cursor-pointer right-0 top-1/2 z-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#272727] text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:text-[#FF6A50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A50]"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1 1L9 9M9 1L1 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function SinglePopup({ item, onDismiss, isHidden }) {
  const wrapperRef = usePopupVisibility(isHidden);

  return (
    <div
      ref={wrapperRef}
      className="group opacity-0 fixed bottom-6 right-6 z-250 inline-flex"
    >
      <CloseButton onDismiss={onDismiss} />

      <PrismicNextLink
        field={item.popup_link}
        className="relative z-10 flex items-center gap-3 bg-white py-1.5 pl-1.5 pr-2 transition-transform duration-300 ease-out group-hover:-translate-x-10 group-focus-within:-translate-x-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A50]"
      >
        <PrismicNextImage
          field={item.image}
          className="h-15 w-20 shrink-0 object-cover"
        />
        <div className="text-sm font-medium text-black [&_p]:m-0">
          <PrismicRichText field={item.title} />
        </div>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-black transition-colors duration-150 group-hover:text-[#FF6A50]"
        >
          <ChevronIcon direction="right" />
        </span>
      </PrismicNextLink>
    </div>
  );
}

function PopupSlider({ items, onDismiss, isHidden }) {
  const wrapperRef = usePopupVisibility(isHidden);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      ref={wrapperRef}
      className="group opacity-0 fixed bottom-6 right-6 z-250 inline-flex"
    >
      <CloseButton onDismiss={onDismiss} />

      <div className="relative z-10 flex items-stretch overflow-hidden bg-white pl-1.5 pr-1.5 transition-transform duration-300 ease-out group-hover:-translate-x-10 group-focus-within:-translate-x-10">
        <div
          ref={emblaRef}
          className="w-75 touch-pan-y overflow-hidden border-r border-r-[#E4E4E4] [-webkit-tap-highlight-color:transparent]"
        >
          <div className="flex py-1.5">
            {items.map((item, index) => (
              <PrismicNextLink
                key={index}
                field={item.popup_link}
                className="flex min-w-0 flex-[0_0_100%] select-none items-center gap-3 pr-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A50]"
              >
                <PrismicNextImage
                  field={item.image}
                  className="h-15 w-15 shrink-0 object-cover"
                  width={60}
                  height={60}
                />
                <div className="truncate text-sm font-medium text-black [&_p]:m-0">
                  <PrismicRichText field={item.title} />
                </div>
              </PrismicNextLink>
            ))}
          </div>
        </div>

        <div className="ml-1 flex flex-col justify-evenly pl-1.5">
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Show next"
            style={{ touchAction: "manipulation" }}
            className="flex h-6 w-6 items-center justify-center text-black transition-colors duration-150 hover:text-[#FF6A50] disabled:text-black/25 disabled:hover:text-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A50]"
          >
            <ChevronIcon direction="right" />
          </button>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Show previous"
            style={{ touchAction: "manipulation" }}
            className="flex h-6 w-6 items-center justify-center text-black transition-colors duration-150 hover:text-[#FF6A50] disabled:text-black/25 disabled:hover:text-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A50]"
          >
            <ChevronIcon direction="left" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================================== */
/* Mobile                               */
/* ==================================== */

function MobileCloseButton({ onDismiss }) {
  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss"
      style={{ touchAction: "manipulation" }}
      className="flex h-11 w-11 shrink-0 items-center justify-center text-black/40 active:text-[#FF6A50] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A50]"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1 1L9 9M9 1L1 9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function MobileSinglePopup({ item, onDismiss, isHidden }) {
  const wrapperRef = usePopupVisibility(isHidden);

  return (
    <div
      ref={wrapperRef}
      className="fixed opacity-0 w-full md:w-[50%] md:right-2 bottom-0 md:bottom-2 z-250 flex items-center border border-[#E4E4E4] bg-white shadow-[0_0_20px_rgba(255,255,255,0.35),0_0_30px_rgba(255,255,255,0.35)] md:shadow-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <PrismicNextLink
        field={item.popup_link}
        style={{ touchAction: "manipulation" }}
        className="flex min-w-0 flex-1 items-center gap-3 border-r border-[#E4E4E4] py-1 px-1 active:bg-black/3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A50]"
      >
        <PrismicNextImage
          field={item.image}
          className="h-12 w-12 shrink-0 object-cover"
          width={48}
          height={48}
        />
        <div className="min-w-0 truncate text-sm font-medium text-black [&_p]:m-0">
          <PrismicRichText field={item.title} />
        </div>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-black/40"
        >
          <ChevronIcon direction="right" />
        </span>
      </PrismicNextLink>

      <MobileCloseButton onDismiss={onDismiss} />
    </div>
  );
}

function MobilePopupSlider({ items, onDismiss, isHidden }) {
  const wrapperRef = usePopupVisibility(isHidden);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      ref={wrapperRef}
     className="fixed opacity-0 w-full md:w-[50%] md:right-2 bottom-0 md:bottom-2 z-250 flex items-center border border-[#E4E4E4]  bg-white shadow-[0_0_20px_rgba(255,255,255,0.35),0_0_30px_rgba(255,255,255,0.35)] md:shadow-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        ref={emblaRef}
        className="min-w-0 flex-1 touch-pan-y overflow-hidden [-webkit-tap-highlight-color:transparent]"
      >

        <div className="flex">
          {items.map((item, index) => (
            <PrismicNextLink
              key={index}
              field={item.popup_link}
              style={{ touchAction: "manipulation" }}
              className="flex min-w-0 flex-[0_0_100%] select-none items-center gap-3 py-1 px-1 active:bg-black/3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A50]"
            >
              <PrismicNextImage
                field={item.image}
                className="h-12 w-12 shrink-0 object-cover"
                width={48}
                height={48}
              />
              <div className="min-w-0 truncate text-sm font-medium text-black [&_p]:m-0">
                <PrismicRichText field={item.title} />
              </div>
            </PrismicNextLink>
          ))}
        </div>
      </div>

      <div className="flex self-stretch shrink-0 border-r border-[#E4E4E4] pr-1">
        <div className="flex flex-row items-center">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Show previous"
            style={{ touchAction: "manipulation" }}
            className="flex h-11 w-6 items-center justify-center text-black active:text-[#FF6A50] disabled:text-black/25 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A50]"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Show next"
            style={{ touchAction: "manipulation" }}
            className="flex h-11 w-6 items-center justify-center text-black active:text-[#FF6A50] disabled:text-black/25 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF6A50]"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <MobileCloseButton onDismiss={onDismiss} />
    </div>
  );
}
