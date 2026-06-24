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
    <div className="max-w-[1920px] mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45">
      <div
        className="  overflow-hidden select-none"
        ref={emblaRef}
        onPointerUp={onPointerUp}
      >
        <div className="flex">
          {slice.primary.carousel_image.map((item, index) => (
            <div key={index} className="flex-none  w-[80%] md:w-[30%] xl:w-[23%] pr-4">
              <div className="relative h-50 md:h-55 xl:h-100">
                <PrismicNextImage
                  field={item.image}
                  fill
                  className="object-contain object-top"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
