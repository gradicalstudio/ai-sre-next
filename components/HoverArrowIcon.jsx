"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

const ArrowIcon = forwardRef(function ArrowIcon({ className, style }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.67057 16.6676H6.00391V14.001H8.67057V16.6676Z" fill="white" />
      <path d="M11.3307 13.9997H8.66406V11.333H11.3307V13.9997Z" fill="white" />
      <path d="M14.0026 11.3337H11.3359V8.66699H14.0026V11.3337Z" fill="white" />
      <path d="M8.67057 11.3337H6.00391V8.66699H8.67057V11.3337Z" fill="white" />
      <path d="M11.3307 8.66569H8.66406V5.99902H11.3307V8.66569Z" fill="white" />
      <path d="M8.67057 5.99967H6.00391V3.33301H8.67057V5.99967Z" fill="white" />
    </svg>
  );
});

/**
 * Two overlaid arrow icons that swap places on hover. Parent triggers the
 * animation imperatively via ref.current.animate(hovering) from its own
 * onMouseEnter/onMouseLeave so the hover target can be the surrounding link.
 */
const HoverArrowIcon = forwardRef(function HoverArrowIcon(
  { className, iconClassName, offset = 16, style },
  ref,
) {
  const arrowARef = useRef(null);
  const arrowBRef = useRef(null);
  const boxRef = useRef(null);
  const tweenRef = useRef(null);
  const distanceRef = useRef(0);

  useEffect(() => {
    if (!arrowARef.current || !arrowBRef.current) return;
    gsap.set(arrowARef.current, { x: 0, opacity: 1 });
    gsap.set(arrowBRef.current, { x: -offset, opacity: 0 });
  }, [offset]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;

    const updateDistance = () => {
      distanceRef.current = box.getBoundingClientRect().width * 1.5;
    };
    updateDistance();

    const ro = new ResizeObserver(updateDistance);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useImperativeHandle(ref, () => ({
    animate(hovering) {
      const a = arrowARef.current;
      const b = arrowBRef.current;
      if (!a || !b) return;

      const distance = distanceRef.current;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      tweenRef.current?.kill();
      tweenRef.current = gsap.timeline({
        defaults: { duration: reduceMotion ? 0 : 0.45, ease: "power3.inOut" },
      });

      tweenRef.current
        .to(a, { x: hovering ? distance : 0, opacity: hovering ? 0 : 1 }, 0)
        .to(b, { x: hovering ? 0 : -distance, opacity: hovering ? 1 : 0 }, 0);
    },
  }));

  return (
    <span ref={boxRef} className={className} style={style}>
      <ArrowIcon ref={arrowARef} className={iconClassName} />
      <ArrowIcon
        ref={arrowBRef}
        className={iconClassName}
        style={{ transform: `translateX(-${offset}px)`, opacity: 0 }}
      />
    </span>
  );
});

export default HoverArrowIcon;
