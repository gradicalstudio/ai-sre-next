"use client";

import { forwardRef, useEffect, useRef } from "react";
import { PrismicNextLink } from "@prismicio/next";
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

const NavCtaButton = forwardRef(function NavCtaButton(
  { field, children, className = "" },
  outerRef,
) {
  const arrowARef = useRef(null);
  const arrowBRef = useRef(null);
  const iconBoxRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!arrowARef.current || !arrowBRef.current) return;
    gsap.set(arrowARef.current, { x: 0, opacity: 1 });
    gsap.set(arrowBRef.current, { x: -16, opacity: 0 });
  }, []);

  const animate = (hovering) => {
    const a = arrowARef.current;
    const b = arrowBRef.current;
    const box = iconBoxRef.current;
    if (!a || !b || !box) return;

    const distance = box.getBoundingClientRect().width * 1.5;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    tweenRef.current?.kill();

    tweenRef.current = gsap.timeline({
      defaults: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "power3.inOut",
      },
    });

    tweenRef.current
      .to(a, { x: hovering ? distance : 0, opacity: hovering ? 0 : 1 }, 0)
      .to(b, { x: hovering ? 0 : -distance, opacity: hovering ? 1 : 0 }, 0);
  };

  return (
    <div ref={outerRef} className={className}>
      <PrismicNextLink
        field={field}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => animate(true)}
        onMouseLeave={() => animate(false)}
        className="flex items-center gap-1.5 bg-[#242424] hover:bg-white/20 transition-colors text-sm font-medium px-4 py-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation"
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
        <span
          ref={iconBoxRef}
          className="relative inline-block overflow-hidden size-4 mt-0.5 text-[#FF6A50]"
        >
          <ArrowIcon ref={arrowARef} className="absolute inset-0 size-full" />
          <ArrowIcon
            ref={arrowBRef}
            className="absolute inset-0 size-full"
            style={{ transform: "translateX(-16px)", opacity: 0 }}
          />
        </span>
      </PrismicNextLink>
    </div>
  );
});

export default NavCtaButton;