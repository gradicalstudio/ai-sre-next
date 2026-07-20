"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { PrismicNextImage } from "@prismicio/next";

/**
 * @typedef {import("@prismicio/client").Content.ImageCarouselSlice} ImageCarouselSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ImageCarouselSlice>} ImageCarouselProps
 * @type {import("react").FC<ImageCarouselProps>}
 */
const ImageCarousel = ({ slice }) => {
  const autoScrollPlugin = AutoScroll({
    speed: 1,
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

  const onPointerUp = () => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;
    autoScroll.play();
  };

  return (
    <section
      id="image-carousel"
      className="max-w-[1920px] mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45 bg-[#04050F]"
    >
      <div
        className="  overflow-hidden select-none"
        ref={emblaRef}
        onPointerUp={onPointerUp}
      >
        <div className="flex">
          {slice.primary.carousel_image.map((item, index) => (
            <div
              key={index}
              className="flex-none  w-[50%] md:w-[30%] xl:w-[23%] pr-4"
            >
              <div className="relative bg-[#222433] w-full h-50 md:h-55 lg:h-70 xl:h-80 2xl:h-90 4xl:h-100">
                <PrismicNextImage
                  field={item.image}
                  fill
                  preload={index < 3}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 30vw, 23vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
