"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

const SpeakerSlider = ({ speakers = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef(null);

  const autoplayRef = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayRef.current,
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Stop autoplay until visible
    autoplayRef.current.stop();

    // Select logic
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();

    // IntersectionObserver

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            autoplayRef.current.play();
          } else {
            autoplayRef.current.stop();
          }
        });
      },
      { threshold: 0.5 },
    );

    if (carouselRef.current) observer.observe(carouselRef.current);

    return () => {
      emblaApi.off("select", onSelect);
      observer.disconnect();
    };
  }, [emblaApi]);

  // Group into pairs
  
  const slides = [];
  for (let i = 0; i < speakers.length; i += 2) {
    slides.push(speakers.slice(i, i + 2));
  }

  const loopSlides = slides.length === 1 ? [...slides, ...slides] : slides;
  return (
    <div ref={carouselRef} className="block md:hidden mt-13 text-white w-full">
      <div className="relative  w-full">
        {/* Prev */}
        <button
          onClick={() => {
            scrollPrev();
            autoplayRef.current.reset();
          }}
          className="absolute left-2 top-0  h-full z-10 text-[#FF6A50] "
          aria-label="Previous"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path
              d="M9 1L1 9L9 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden mx-8">
          {/* Embla container */}
          <div className="flex">
            {loopSlides.map((pair, slideIndex) => (
              <div
                key={slideIndex}
                style={{ flex: "0 0 100%", minWidth: 0 }}
                className="grid grid-cols-2 gap-6 px-2"
              >
                {pair.map((item, i) => (
                  <div key={i} className="flex flex-col gap-3 min-w-0">
                    {/* Avatar */}
                    <div
                      className="
                      group w-full aspect-square max-w-32.5
                      rounded-full p-0.5 bg-transparent
                      transition-all duration-300
                      
                    "
                    >
                      <div className="rounded-full overflow-hidden h-full w-full">
                        <PrismicNextImage
                          field={item.speaker_image}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="font-medium text-sm leading-snug wrap-break-word">
                        <PrismicRichText field={item.name_rich_text} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1 leading-snug wrap-break-word">
                        <PrismicRichText field={item.role_rich_text} />
                      </div>
                      {item.linkedin?.url && (
                        <div className="flex mt-2">
                          <PrismicNextLink field={item.linkedin}>
                            <img
                              src="/Linkden.svg"
                              className="w-5 h-5"
                              alt="LinkedIn"
                            />
                          </PrismicNextLink>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => {
            scrollNext();
            autoplayRef.current.reset();
          }}
          className="absolute right-2 top-0 h-full z-10 text-[#FF6A50] transition-colors"
          aria-label="Next"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path
              d="M1 1L9 9L1 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              scrollTo(i);
              autoplayRef.current.reset();
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-4 h-2 bg-[#FA6D55]"
                : "w-2 h-2 bg-[#FF6A5036] hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpeakerSlider;