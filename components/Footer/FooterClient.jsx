"use client";

import { useRef, useLayoutEffect } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FooterClient({
  title,
  email_block,
  logo,
  footer_links,
}) {
  const containerRef = useRef(null);
  const wordsWrapRef = useRef(null);
  const imageWrapRef = useRef(null);
  const lineScaleRef = useRef(null);
  const contactRef = useRef(null);
  const linksRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const letters = wordsWrapRef.current?.querySelectorAll("[data-letter]");

      if (prefersReducedMotion) {
        // Skip straight to the end state, no animation.
        gsap.set(letters, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(imageWrapRef.current, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(lineScaleRef.current, { scaleX: 1 });
        gsap.set(contactRef.current, { y: 0, opacity: 1 });
        gsap.set(linksRef.current?.children, { y: 0, opacity: 1 });
        return;
      }

      //   gsap.set(letters, { clipPath: "inset(0 100% 0 0)" });
      //   gsap.set(imageWrapRef.current, { clipPath: "inset(0 100% 0 0)" });
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

      //   tl.to(letters, {
      //     clipPath: "inset(0 0% 0 0)",
      //     duration: 0.4,
      //     stagger: 0.02,
      //     ease: "sine.in",
      //   });

      tl.fromTo(
        [letters, imageWrapRef.current],
        { opacity: 0, y: 80, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5 },
      );

      //   tl.to(
      //     imageWrapRef.current,
      //     {
      //       clipPath: "inset(0 0% 0 0)",
      //       duration: 0.3,
      //       ease: "sine.in",
      //     },
      //     ">-0.1",
      //   );

      tl.to(
        lineScaleRef.current,
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power4.in",
          // Free the compositor layer once the one-time animation is done.
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

  return (
    <footer
      id="site-footer"
      className="bg-[#FF6A50] text-black px-3 pt-10 lg:px-6 lg:pt-30 pb-5 lg:pb-10"
    >
      <div
        ref={containerRef}
        className="max-w-[1920px] mx-auto flex flex-col gap-5 lg:gap-16"
      >
        <h2 className="m-0 font-normal flex flex-wrap items-end gap-3 text-[26.73px] md:text-[30px] lg:text-[50px] xl:text-[72px] 2xl:text-[110px] leading-none w-[85%] md:w-[47%] lg:w-[60%] 2xl:w-[85%] 4xl:w-[70%]">
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
                ref={imageWrapRef}
                className="inline-block will-change-[clip-path]"
                // style={{ clipPath: "inset(0 100% 0 0)" }}
              >
                <PrismicNextImage
                  field={logo}
                  className="h-7 md:h-8 lg:h-12.5 xl:h-17 2xl:h-26 4xl:h-26.25 w-auto inline lg:mb-1 2xl:mb-2"
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
                      className="underline-offset-2 hover:underline transition-colors rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
                  className="text-sm md:self-end  hover:underline underline-offset-1 transition-colors rounded-sm focus-visible:outline md:focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
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
                className="inline-block will-change-[clip-path] align-baseline"
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
