"use client";

import { useRef, useLayoutEffect } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARK_COVER_OFFSET = -453;
const MASK_X_PAD = 20;
const MASK_REVEAL_WIDTH = 460 + MASK_X_PAD;
const REVEAL_DURATION = 1.4;
const COVER_DURATION = 1.4;
const REVEAL_EASE = "circ.inOut";
const COVER_EASE = "power4.out";
const INTRO_DEMO_HOLD = 5;

export default function FooterClient({ title, email_block, footer_links }) {
  const containerRef = useRef(null);
  const wordsWrapRef = useRef(null);
  const logoWrapRef = useRef(null);
  const markRef = useRef(null);
  const maskRectRef = useRef(null);
  const lineScaleRef = useRef(null);
  const contactRef = useRef(null);
  const linksRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    reducedMotionRef.current = prefersReducedMotion;

    const ctx = gsap.context(() => {
      const letters = wordsWrapRef.current?.querySelectorAll("[data-letter]");
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      gsap.set(markRef.current, { x: MARK_COVER_OFFSET });

      if (prefersReducedMotion) {
        gsap.set(letters, { y: 0, opacity: 1, filter: "blur(0px)" });
        gsap.set(markRef.current, { x: 0 });
        gsap.set(maskRectRef.current, { attr: { width: MASK_REVEAL_WIDTH } });
        gsap.set(logoWrapRef.current, { opacity: 1 });
        gsap.set(lineScaleRef.current, { scaleX: 1 });
        gsap.set(contactRef.current, { y: 0, opacity: 1 });
        gsap.set(linksRef.current?.children, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(letters, { y: 20, opacity: 0, filter: "blur(8px)" });
      gsap.set(maskRectRef.current, { attr: { width: 0 } });
      gsap.set(logoWrapRef.current, { opacity: 0 });
      gsap.set(lineScaleRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(contactRef.current, { y: 20, opacity: 0 });
      gsap.set(linksRef.current?.children, { y: 20, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      //Title
      tl.to(letters, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.045,
        ease: "power3.out",
      });

      tl.to(
        logoWrapRef.current,
        {
          opacity: 1,
          duration: 0.4,
        },
        ">-0.5",
      );

      // Mark slides
      tl.to(
        markRef.current,
        { x: 0, duration: REVEAL_DURATION, ease: REVEAL_EASE },
        ">-0.4",
      );

      tl.to(
        maskRectRef.current,
        {
          attr: { width: MASK_REVEAL_WIDTH },
          duration: REVEAL_DURATION,
          ease: REVEAL_EASE,
        },
        "<",
      );

      if (isDesktop) {
        tl.to(
          markRef.current,
          { x: MARK_COVER_OFFSET, duration: COVER_DURATION, ease: COVER_EASE },
          `+=${INTRO_DEMO_HOLD}`,
        );
        tl.to(
          maskRectRef.current,
          { attr: { width: 0 }, duration: COVER_DURATION, ease: COVER_EASE },
          "<",
        );
      }

      tl.to(
        lineScaleRef.current,
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power4.in",
          onComplete: () => {
            gsap.set(lineScaleRef.current, { willChange: "auto" });
          },
        },
        0,
      );
      tl.to(
        contactRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
        },
        ">+0.2",
      );

      tl.to(
        linksRef.current?.children,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.09,
        },
        ">",
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  function slideToEnd() {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop || !markRef.current || !maskRectRef.current) return;
    gsap.killTweensOf([markRef.current, maskRectRef.current]);
    const duration = reducedMotionRef.current ? 0 : REVEAL_DURATION;
    const tl = gsap.timeline();
    tl.to(markRef.current, { x: 0, duration, ease: REVEAL_EASE }, 0);
    tl.to(
      maskRectRef.current,
      { attr: { width: MASK_REVEAL_WIDTH }, duration, ease: REVEAL_EASE },
      0,
    );
  }

  function slideBackToStart() {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop || !markRef.current || !maskRectRef.current) return;
    gsap.killTweensOf([markRef.current, maskRectRef.current]);
    const duration = reducedMotionRef.current ? 0 : COVER_DURATION;
    const tl = gsap.timeline();
    tl.to(
      markRef.current,
      { x: MARK_COVER_OFFSET, duration, ease: COVER_EASE },
      0,
    );
    tl.to(
      maskRectRef.current,
      { attr: { width: 0 }, duration, ease: COVER_EASE },
      0,
    );
  }

  return (
    <footer
      id="site-footer"
      className="bg-[#FF6A50] text-black px-3 pt-10 lg:px-6 lg:pt-30 pb-5 lg:pb-10"
    >
      <div
        ref={containerRef}
        className="max-w-[1920px] mx-auto flex flex-col gap-5 lg:gap-16"
      >
        <h2 className="m-0 font-normal flex flex-wrap items-center gap-3 text-[26.73px] md:text-[30px] lg:text-[50px] xl:text-[72px] 2xl:text-[110px] leading-none max-w-80 md:max-w-90 lg:max-w-140 xl:max-w-200 2xl:max-w-300 4xl:w-[70%]">
          <div className="[&_p]:inline" ref={wordsWrapRef}>
            <PrismicRichText
              field={title}
              components={{
                paragraph: ({ node }) => <SplitWords text={node.text} />,
                heading1: ({ node }) => <SplitWords text={node.text} />,
              }}
            />
            <span className="ml-2 lg:ml-4 2xl:ml-6">
              <span
                ref={logoWrapRef}
                role="img"
                aria-label="Stackgen"
                tabIndex={0}
                onMouseEnter={slideToEnd}
                onMouseLeave={slideBackToStart}
                onFocus={slideToEnd}
                onBlur={slideBackToStart}
                className="inline-block h-7 md:h-8 lg:h-12.5 xl:h-17 2xl:h-26 4xl:h-26.25 translate-y-[19%] xl:translate-y-[20%]  align-baseline rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                <StackgenLogo
                  markRef={markRef}
                  maskRectRef={maskRectRef}
                  className="h-full w-auto"
                />
              </span>
            </span>
          </div>
        </h2>

        {/* Bottom row: email + footer links */}
        <div className="flex flex-col pt-3 lg:pt-5 font-medium">
          <div
            ref={lineScaleRef}
            className="w-full mb-4.25 h-0.5 bg-black will-change-transform"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
          <div className="flex flex-col md:flex-row lg:items-center justify-between gap-6">
            <div ref={contactRef} className="text-sm">
              <PrismicRichText
                field={email_block}
                components={{
                  hyperlink: ({ node, children }) => (
                    <a
                      href={node.data.url}
                      target={node.data.target}
                      rel={
                        node.data.target === "_blank"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="underline-offset-2 hover:underline transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      {children}
                    </a>
                  ),
                }}
              />
            </div>

            <div ref={linksRef} className="flex gap-6 lg:gap-10">
              {footer_links?.map((item, index) => (
                <PrismicNextLink
                  key={item.key ?? index}
                  field={item}
                  className="text-sm md:self-end  hover:underline underline-offset-1 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SplitWords({ text = "" }) {
  const words = text.split(" ");

  return (
    <>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((letter, letterIndex) => (
              <span
                key={letterIndex}
                data-letter
                className="inline-block will-change-[transform,opacity,filter] align-baseline"
              >
                {letter}
              </span>
            ))}
            {wordIndex < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

function StackgenLogo({ markRef, maskRectRef, className }) {
  return (
    <svg
      viewBox="0 0 536 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="stackgen-wordmark-feather"
          x="0"
          y="0"
          width="536"
          height="108"
          filterUnits="userSpaceOnUse"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="6 0" />
        </filter>
        <mask id="stackgen-wordmark-mask">
          <rect
            ref={maskRectRef}
            x={-MASK_X_PAD}
            y="0"
            width="0"
            height="108"
            fill="#fff"
            filter="url(#stackgen-wordmark-feather)"
          />
        </mask>
      </defs>
      <g id="logo-text" mask="url(#stackgen-wordmark-mask)">
        <path
          d="M9.41653 87.2859C5.17992 84.4934 2.13485 80.8567 0.347534 76.5056C-0.115845 75.4016 -0.115845 74.2326 0.347534 73.1935C0.810914 72.0895 1.67147 71.3102 2.79682 70.8556C3.92217 70.401 5.11372 70.401 6.17287 70.8556C7.29822 71.3102 8.09259 72.1545 8.55596 73.2585C9.68131 76.051 11.601 78.3889 14.3151 80.1423C17.0292 81.8958 20.0081 82.8049 23.1855 82.8049C26.363 82.8049 30.07 81.636 32.6517 79.363C35.2996 77.0251 36.6235 74.2326 36.6235 71.0505C36.6235 67.8683 35.4982 65.0109 33.2475 63.3224C31.3939 61.9586 27.6207 60.5299 21.994 59.0362C15.5729 57.2828 10.9391 55.4644 8.15878 53.4512C3.3264 50.0742 0.943308 45.2036 0.943308 38.8393C0.943308 32.475 3.12781 28.3837 7.43061 24.4222C11.7996 20.3958 17.0292 18.4475 23.1855 18.4475C29.3418 18.4475 32.9165 19.8763 36.8221 22.7987C40.7939 25.721 43.4418 29.5526 44.8981 34.4232C45.2291 35.5922 45.0967 36.6962 44.5672 37.7353C43.9714 38.7743 43.1108 39.4887 41.9193 39.8134C40.7939 40.1381 39.6686 40.0082 38.5432 39.4887C37.4841 38.9042 36.7559 38.06 36.4249 36.891C35.5644 33.9037 33.9094 31.5009 31.5263 29.7474C29.1432 27.994 26.363 27.1498 23.1855 27.1498C20.0081 27.1498 16.3672 28.3187 13.7193 30.5917C11.0715 32.9296 9.74751 35.7221 9.74751 38.9042C9.74751 42.0864 10.8729 44.8139 13.1236 46.4375C14.9109 47.7363 18.6179 49.165 24.2447 50.7236C30.732 52.4771 35.432 54.3604 38.2122 56.3736C43.0446 59.8155 45.4277 64.7511 45.4277 71.1803C45.4277 77.6096 43.2432 81.636 38.9404 85.5974C34.5714 89.6238 29.3418 91.5721 23.1855 91.5721C17.0292 91.5721 13.7193 90.2083 9.48272 87.4158L9.41653 87.2859Z"
          fill="#04050F"
        />
        <path
          d="M77.4777 36.8295C78.7355 36.8295 79.8608 37.2841 80.7214 38.1933C81.582 39.0376 82.0453 40.1416 82.0453 41.3755C82.0453 42.6093 81.582 43.7134 80.7214 44.5576C79.8608 45.4668 78.7355 45.9214 77.4777 45.9214H70.2623V86.9646C70.2623 88.1985 69.7989 89.3025 68.9383 90.1468C68.0778 90.991 66.9524 91.4456 65.6947 91.4456C64.4369 91.4456 63.3116 90.991 62.451 90.1468C61.5243 89.3025 61.0609 88.1985 61.0609 86.9646V45.9214H53.9116C52.6539 45.9214 51.5285 45.4668 50.6018 44.5576C49.7412 43.7134 49.2778 42.6093 49.2778 41.3755C49.2778 40.1416 49.7412 39.0376 50.6018 38.1933C51.5285 37.2841 52.6539 36.8295 53.9116 36.8295H61.0609V22.867C61.0609 21.6331 61.5243 20.5291 62.451 19.6849C63.3116 18.7757 64.4369 18.3211 65.6947 18.3211C66.9524 18.3211 68.0778 18.7757 68.9383 19.6849C69.7989 20.5291 70.2623 21.6331 70.2623 22.867V36.8295H77.4777Z"
          fill="#04050F"
        />
        <path
          d="M130.093 36.8279C131.351 36.8279 132.476 37.2825 133.337 38.1917C134.197 39.036 134.661 40.14 134.661 41.3739V86.9631C134.661 88.197 134.197 89.301 133.337 90.1452C132.476 90.9894 131.351 91.444 130.093 91.444C128.835 91.444 127.71 90.9894 126.849 90.1452C125.923 89.301 125.459 88.197 125.459 86.9631V84.5602C120.296 89.1711 114.272 91.444 107.321 91.444C100.371 91.444 93.2875 88.7814 87.9917 83.4562C82.6297 78.131 79.9157 71.7017 79.9157 64.1685C79.9157 56.6352 82.6297 50.141 87.9917 44.8158C93.3537 39.4256 99.7748 36.763 107.321 36.763C114.868 36.763 120.296 39.036 125.459 43.6468V41.3089C125.459 40.075 125.923 38.971 126.849 38.1268C127.71 37.2176 128.835 36.763 130.093 36.763V36.8279ZM107.321 82.4171C112.352 82.4171 116.589 80.6637 120.163 77.0919C123.672 73.5201 125.459 69.2339 125.459 64.2334C125.459 59.2329 123.672 54.8818 120.163 51.31C116.589 47.7382 112.352 45.9847 107.321 45.9847C102.29 45.9847 98.0536 47.7382 94.479 51.31C90.9044 54.8818 89.1171 59.2329 89.1171 64.2334C89.1171 69.2339 90.9044 73.5201 94.479 77.0919C98.0536 80.6637 102.29 82.4171 107.321 82.4171Z"
          fill="#04050F"
        />
        <path
          d="M170.004 45.9176C164.973 45.9176 160.736 47.6711 157.161 51.2429C153.587 54.8147 151.799 59.1658 151.799 64.1663C151.799 69.1668 153.587 73.453 157.161 77.0248C160.736 80.5966 164.973 82.35 170.004 82.35C175.035 82.35 180.992 79.8173 184.699 74.8168C185.427 73.8426 186.42 73.1932 187.744 72.9984C188.009 72.9335 188.34 72.8685 188.605 72.8685C189.532 72.8685 190.392 73.1283 191.187 73.7128C192.246 74.4271 192.842 75.4012 193.04 76.6351C193.106 76.8949 193.173 77.2196 193.173 77.4794C193.173 78.3886 192.908 79.2328 192.312 80.0121C186.818 87.5454 179.404 91.312 170.136 91.312C160.868 91.312 156.102 88.6494 150.806 83.3242C145.445 77.9989 142.73 71.5697 142.73 64.0364C142.73 56.5032 145.445 50.009 150.806 44.6838C156.168 39.2936 162.59 36.631 170.136 36.631C177.682 36.631 186.818 40.3976 192.312 47.9308C192.908 48.7102 193.173 49.6193 193.173 50.5285C193.173 51.4377 193.173 51.048 193.04 51.3728C192.842 52.6067 192.246 53.5808 191.187 54.3601C190.392 54.9446 189.532 55.2043 188.605 55.2043C187.678 55.2043 188.075 55.2043 187.744 55.1394C186.487 54.9446 185.427 54.3601 184.699 53.321C181.058 48.3205 176.16 45.8527 170.004 45.8527V45.9176Z"
          fill="#04050F"
        />
        <path
          d="M239.325 83.5877C240.252 84.4319 240.715 85.5359 240.782 86.7049C240.848 87.9388 240.451 89.0428 239.524 90.0169C238.663 90.991 237.472 91.4456 236.148 91.4456C234.824 91.4456 233.897 91.056 233.037 90.2117L210 69.5602V86.8347C210 88.0686 209.537 89.1727 208.676 90.0818C207.749 90.9261 206.69 91.3807 205.432 91.3807C204.175 91.3807 203.049 90.9261 202.123 90.0818C201.262 89.1727 200.799 88.0686 200.799 86.8347V22.867C200.799 21.6331 201.262 20.5291 202.123 19.6199C203.049 18.7757 204.175 18.3211 205.432 18.3211C206.69 18.3211 207.749 18.7757 208.676 19.6199C209.537 20.5291 210 21.6331 210 22.867V56.8966L231.713 37.9335C232.639 37.0893 233.765 36.6996 235.089 36.7646C236.346 36.8295 237.406 37.3491 238.266 38.2582C239.127 39.1674 239.524 40.2714 239.458 41.5703C239.392 42.8042 238.862 43.8433 237.935 44.6875L216.686 63.2609L239.325 83.5877Z"
          fill="#04050F"
        />
        <path
          d="M309.089 52.8013C310.347 52.8013 311.472 53.2559 312.399 54.1002C313.259 55.0094 313.723 56.1134 313.723 57.3473V69.4914C313.723 76.635 309.685 82.3499 301.675 86.5711C295.452 89.8182 288.369 91.4417 280.558 91.4417C272.747 91.4417 261.824 87.8699 254.675 80.7263C247.526 73.5827 243.885 65.0104 243.885 54.8795C243.885 44.7486 247.459 36.1762 254.675 29.0326C261.824 21.889 270.43 18.2523 280.558 18.2523C290.686 18.2523 293.863 20.0707 299.689 23.6425C305.514 27.2143 310.016 32.0849 313.193 38.2544C313.524 38.9038 313.656 39.6181 313.656 40.2676C313.656 40.917 313.59 41.2417 313.392 41.6963C312.994 42.8652 312.2 43.7095 311.075 44.294C310.413 44.6187 309.751 44.7486 309.023 44.7486C308.294 44.7486 308.03 44.6836 307.566 44.4888C306.375 44.0991 305.448 43.3198 304.918 42.2158C302.535 37.6049 299.159 33.9682 294.79 31.2406C290.421 28.578 285.721 27.2792 280.492 27.2792C272.945 27.2792 266.458 29.9418 261.162 35.332C255.8 40.7222 253.086 47.2163 253.086 54.8145C253.086 62.4127 255.8 68.842 261.162 74.2322C266.524 79.6223 272.945 82.2849 280.492 82.2849C288.038 82.2849 291.414 81.1809 296.18 78.9729C301.675 76.4402 304.389 73.258 304.389 69.3615V61.6984H282.279C281.021 61.6984 279.896 61.2438 279.035 60.3995C278.175 59.4904 277.711 58.4513 277.711 57.2174C277.711 55.9835 278.175 54.8795 279.035 53.9703C279.896 53.126 281.021 52.6715 282.279 52.6715H309.023L309.089 52.8013Z"
          fill="#04050F"
        />
        <path
          d="M326.578 83.4542C323.996 80.9215 322.01 78.0641 320.62 74.817C319.164 71.44 318.369 67.8682 318.369 64.2315C318.369 56.6982 321.083 50.204 326.578 44.8788C329.159 42.3461 332.138 40.3978 335.514 39.034C338.956 37.6053 342.597 36.826 346.437 36.826C354.116 36.826 360.735 39.4886 366.23 44.8788C368.811 47.4115 370.797 50.3339 372.187 53.581C373.644 56.958 374.438 60.5298 374.438 64.2315C374.438 67.9331 373.975 66.5694 373.114 67.4136C372.187 68.3228 371.062 68.7774 369.804 68.7774H328.233C329.292 72.7388 331.476 75.9859 334.852 78.5187C338.228 81.1163 342.134 82.4152 346.437 82.4152C353.255 82.4152 358.551 80.337 362.258 76.2457C363.052 75.3365 364.111 74.817 365.435 74.752C366.693 74.752 367.818 75.0767 368.811 75.856C369.738 76.7003 370.268 77.7393 370.334 78.9732C370.4 80.2071 370.003 81.3112 369.142 82.2203C363.582 88.3249 356.035 91.4421 346.437 91.4421C336.838 91.4421 332.072 88.7795 326.578 83.4542ZM364.641 59.6855C363.582 55.6591 361.397 52.412 358.087 49.8144C354.645 47.2167 350.806 45.9179 346.503 45.9179C342.2 45.9179 338.295 47.2167 334.852 49.8144C331.542 52.412 329.358 55.7241 328.299 59.6855H364.707H364.641Z"
          fill="#04050F"
        />
        <path
          d="M407.456 36.6998C414.473 36.6998 420.497 39.3624 425.528 44.7526C430.559 50.0778 433.008 56.507 433.008 64.1052V87.0297C433.008 88.2636 432.545 89.3027 431.618 90.2119C430.757 91.0561 429.632 91.5107 428.374 91.5107C427.116 91.5107 425.991 91.0561 425.13 90.2119C424.27 89.3027 423.807 88.2636 423.807 87.0297V64.1052C423.807 59.0398 422.218 54.7536 419.04 51.1818C415.797 47.61 411.957 45.8566 407.456 45.8566C402.954 45.8566 399.049 47.61 395.871 51.1818C392.694 54.7536 391.105 59.1047 391.105 64.1052V86.8998C391.105 88.1337 390.642 89.2377 389.781 90.082C388.854 90.9262 387.795 91.3808 386.538 91.3808C385.28 91.3808 384.155 90.9262 383.228 90.082C382.367 89.2377 381.904 88.1337 381.904 86.8998V41.2457C381.904 40.0118 382.367 38.9078 383.228 38.0636C384.155 37.1544 385.28 36.6998 386.538 36.6998C387.795 36.6998 388.854 37.1544 389.781 38.0636C390.642 38.9078 391.105 40.0118 391.105 41.2457V43.0641C395.871 38.8429 401.299 36.6998 407.522 36.6998H407.456Z"
          fill="#04050F"
        />
      </g>
      <g
        id="logo-mark"
        ref={markRef}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M465.641 25.1974C456.771 33.8997 452.865 45.784 453.924 57.2138C454.785 66.5005 458.889 75.1377 465.641 81.7618L475.306 91.2433C477.225 93.1266 480.337 93.1266 482.256 91.2433L507.61 66.3706C508.007 65.9809 508.338 65.5913 508.735 65.2016C514.627 58.2528 504.101 49.2909 497.614 55.6552L478.814 74.0986L476.166 71.501C466.171 61.6947 466.104 45.3944 476.166 35.5232L499.732 12.4039C502.645 9.54645 502.645 4.93558 499.732 2.14308C496.82 -0.71436 492.12 -0.71436 489.273 2.14308L465.707 25.2624L465.641 25.1974ZM512.839 71.436L489.207 94.6203C486.294 97.4777 486.294 102.089 489.207 104.881C492.12 107.739 496.82 107.739 499.666 104.881L523.299 81.6969C532.169 72.9946 536.008 61.1752 534.949 49.6805C534.089 40.4588 530.051 31.8215 523.232 25.1325L513.568 15.651C511.648 13.7677 508.537 13.7677 506.617 15.651L481.263 40.5237C480.866 40.9134 480.535 41.303 480.138 41.6927C474.247 48.6414 484.772 57.6034 491.259 51.2391L510.059 32.7956L512.707 35.3933C522.703 45.1995 522.769 61.4999 512.707 71.3711L512.839 71.436Z"
          fill="#04050F"
        />
      </g>
    </svg>
  );
}
