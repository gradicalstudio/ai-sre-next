"use client";

import { forwardRef, useEffect, useRef } from "react";
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

const ReportButton = ({
  buttonText,
  onClick,
  type = "button",
  disabled = false,
  outerClassName = "",
  innerClassName = "",
  buttonClassName = "",
  arrowClassName = "",
}) => {
  const arrowARef = useRef(null);
  const arrowBRef = useRef(null);
  const iconBoxRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!arrowARef.current || !arrowBRef.current) return;
    gsap.set(arrowARef.current, { x: 0, opacity: 1 });
    gsap.set(arrowBRef.current, { x: -20, opacity: 0 });
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
    <div
      className={`group bg-[#FF6A50] lg:bg-[#04050F]  w-fit transition-color duration-450 lg:hover:bg-[#FF6A50] inline-flex md:w-fit cursor-pointer items-center justify-center px-2 py-1 lg:px-3 lg:py-[6.5px] ${outerClassName}`}
      onMouseEnter={() => animate(true)}
      onMouseLeave={() => animate(false)}
    >
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`text-white cursor-pointer w-fit md:w-fit rounded-full pl-4 pr-2.5 py-1 lg:pl-4 lg:pr-2.5 lg:py-2 flex items-center bg-[#04050F] disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        <div
          className={`flex items-center justify-center text-xs md:text-sm lg:text-base gap-1 md:gap-2 w-full ${innerClassName}`}
        >
          <span>{buttonText}</span>
          <span
            ref={iconBoxRef}
            className={`relative inline-block overflow-hidden size-4 md:size-4 lg:size-5 ${arrowClassName}`}
            style={{ transform: "translateZ(0)" }}
          >
            <ArrowIcon ref={arrowARef} className="absolute inset-0 size-4 md:size-4 lg:size-5" />
            <ArrowIcon
              ref={arrowBRef}
              className="absolute inset-0 size-4 md:size-4 lg:size-5"
              style={{ transform: "translateX(-20px)", opacity: 0 }}
            />
          </span>
        </div>
      </button>
    </div>
  );
};

export default ReportButton;