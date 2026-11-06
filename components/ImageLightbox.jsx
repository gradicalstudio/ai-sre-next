"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { PrismicNextImage } from "@prismicio/next";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const PHONE_LANDSCAPE = "(orientation: landscape) and (max-height: 500px)";
const PHONE_PORTRAIT = "(max-width: 767px) and (orientation: portrait)";
const DESKTOP = "(min-width: 1024px)";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Per layout: slide padding (room for the top bar and side arrows), strip
// padding and thumbnail size.
const LAYOUT = {
  desktop: {
    slide: "px-20 pt-16",
    strip: "px-20 pt-3 pb-5",
    thumb: "h-16 w-24",
  },
  tablet: {
    slide: "px-16 pt-16",
    strip: "px-16 pt-3 pb-5",
    thumb: "h-14 w-20",
  },
  phonePortrait: {
    slide: "px-0 pt-16",
    strip: "px-4 pt-3 pb-4",
    thumb: "h-10 w-14",
  },
  phoneLandscape: {
    slide: "px-12 pt-3",
    strip: "px-12 pt-1 pb-2",
    thumb: "h-8 w-12",
  },
};

// The "tap/click photo for full view" tip shows once per page visit.
let toggleTipSeen = false;

const circularDistance = (a, b, length) => {
  const d = Math.abs(a - b);
  return Math.min(d, length - d);
};

/**
 * Full-screen viewer for the image carousel: the selected photo uncropped,
 * with a thumbnail strip underneath. On desktop and on phones held sideways,
 * clicking the photo hides the strip so the photo fills the screen.
 */
export default function ImageLightbox({ images, startIndex, onClose }) {
  const dialogRef = useRef(null);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);
  const stripDrag = useRef(null);
  const onCloseRef = useRef(onClose);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, startIndex });
  const [selected, setSelected] = useState(startIndex);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [showTip, setShowTip] = useState(() => !toggleTipSeen);

  const isPhoneLandscape = useMediaQuery(PHONE_LANDSCAPE);
  const isPhonePortrait = useMediaQuery(PHONE_PORTRAIT);
  const isDesktopWidth = useMediaQuery(DESKTOP);

  const layout = isPhoneLandscape
    ? "phoneLandscape"
    : isPhonePortrait
      ? "phonePortrait"
      : isDesktopWidth
        ? "desktop"
        : "tablet";
  const sizes = LAYOUT[layout];
  const isDesktop = layout === "desktop";
  const canToggle = isDesktop || isPhoneLandscape;
  const isPhotoOnly = photoOnly && canToggle;
  const showArrows = isDesktop || layout === "tablet";
  const tipVisible = showTip && canToggle;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Keep the active thumbnail centred in the strip. Scrolls only the strip,
  // never the page behind the modal.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[selected];
    if (isPhotoOnly || !strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [selected, isPhotoOnly]);

  useEffect(() => {
    if (!tipVisible) return;
    toggleTipSeen = true;
    const timer = setTimeout(() => setShowTip(false), 3000);
    return () => clearTimeout(timer);
  }, [tipVisible]);

  // Scroll lock, initial focus, and focus return on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.querySelector("[data-autofocus]")?.focus();

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "ArrowLeft") {
        emblaApi?.scrollPrev();
      } else if (e.key === "ArrowRight") {
        emblaApi?.scrollNext();
      } else if (e.key === "Tab") {
        const focusables = [
          ...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? []),
        ].filter((el) => !el.closest("[inert]"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        // Clicking the photo (not focusable) drops focus to <body>.
        if (!dialogRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [emblaApi]);

  // A click on the photo switches layout (where allowed); a click on the dark
  // space around it closes. Embla swallows the click that ends a swipe.
  const onSlideClick = (e) => {
    if (e.target.tagName !== "IMG") {
      onClose();
      return;
    }
    if (!canToggle) return;
    setPhotoOnly((value) => !value);
    setShowTip(false);
  };

  // Mouse drag-to-scroll for the thumbnail strip. Touch and trackpads already
  // scroll it natively. A drag past 5px doesn't count as a thumbnail click.
  const onStripPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    stripDrag.current = {
      startX: e.clientX,
      startScroll: stripRef.current.scrollLeft,
      moved: false,
    };
  };

  const onStripPointerMove = (e) => {
    const drag = stripDrag.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(dx) < 5) return;
      drag.moved = true;
      stripRef.current.setPointerCapture(e.pointerId);
    }
    stripRef.current.scrollLeft = drag.startScroll - dx;
  };

  const onStripPointerUp = () => {
    // Keep a finished drag around so the click that follows can be ignored.
    if (!stripDrag.current?.moved) stripDrag.current = null;
  };

  const onStripClickCapture = (e) => {
    if (stripDrag.current?.moved) {
      e.stopPropagation();
      e.preventDefault();
    }
    stripDrag.current = null;
  };

  const photoCursor = isDesktop
    ? isPhotoOnly
      ? "cursor-zoom-out"
      : "cursor-zoom-in"
    : "";

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      data-lenis-prevent
      className="fixed inset-0 z-650 flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <p
        aria-live="polite"
        className={`absolute z-20 text-sm text-white/60 transition-all duration-300 ${
          isPhotoOnly
            ? "bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-0.5"
            : "top-5 left-5"
        }`}
      >
        {selected + 1} / {images.length}
      </p>

      <button
        type="button"
        data-autofocus
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#0E1618] text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        ✕
      </button>

      <div className="relative min-h-0 flex-1">
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full touch-pan-y">
            {images.map((item, index) => (
              <div
                key={index}
                onClick={onSlideClick}
                className={`flex h-full min-w-0 flex-[0_0_100%] items-center justify-center transition-[padding] duration-300 ${
                  sizes.slide
                } ${isPhotoOnly ? "pb-12" : "pb-3"}`}
              >
                <PrismicNextImage
                  field={item.image}
                  sizes="100vw"
                  loading={
                    circularDistance(index, selected, images.length) <= 1
                      ? "eager"
                      : "lazy"
                  }
                  draggable={false}
                  className={`h-auto max-h-full w-auto max-w-full object-contain select-none ${photoCursor}`}
                />
              </div>
            ))}
          </div>
        </div>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous photo"
              className="absolute top-1/2 left-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next photo"
              className="absolute top-1/2 right-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl text-white transition-colors hover:bg-white/20"
            >
              ›
            </button>
          </>
        )}

        {canToggle && (
          <p
            aria-hidden="true"
            className={`pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs whitespace-nowrap text-white transition-opacity duration-500 ${
              tipVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {isDesktop ? "Click" : "Tap"} photo for full view
          </p>
        )}
      </div>

      {layout === "phonePortrait" && (
        <div aria-hidden="true" className="pt-1 text-center">
          <p className="text-xs text-white/60">← Swipe to browse →</p>
          <div className="flex justify-center gap-1 pt-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === selected ? "w-3.5 bg-white" : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div
        ref={stripRef}
        inert={isPhotoOnly}
        onPointerDown={onStripPointerDown}
        onPointerMove={onStripPointerMove}
        onPointerUp={onStripPointerUp}
        onPointerCancel={() => (stripDrag.current = null)}
        onClickCapture={onStripClickCapture}
        className={`flex gap-2 overflow-x-auto select-none [scrollbar-width:none] transition-all duration-300 [&>:first-child]:ml-auto [&>:last-child]:mr-auto ${
          isPhotoOnly ? "max-h-0 py-0 opacity-0" : `max-h-32 ${sizes.strip}`
        }`}
      >
        {images.map((item, index) => (
          <button
            key={index}
            ref={(el) => {
              thumbRefs.current[index] = el;
            }}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Show photo ${index + 1}`}
            aria-current={index === selected}
            className={`relative flex-none overflow-hidden rounded-[3px] border-2 transition-opacity ${
              sizes.thumb
            } ${
              index === selected
                ? "border-white opacity-100"
                : "border-transparent opacity-45 hover:opacity-80"
            }`}
          >
            <PrismicNextImage
              field={item.image}
              fill
              sizes="96px"
              alt=""
              draggable={false}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
