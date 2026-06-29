import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import MarqueeLib from "react-fast-marquee";

/**
 * @typedef {import("@prismicio/client").Content.MarqueeSlice} MarqueeSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<MarqueeSlice>} MarqueeProps
 * @type {import("react").FC<MarqueeProps>}
 */
const Marquee = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45"
    >
      <div className="text-white text-center text-[16px] leading-7 md:text-xl lg:text-2xl 4xl:text-[44px]">
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            strong: ({ children }) => (
              <strong className="font-mono   font-medium text-white not-italic">
                <span className="bg-linear-to-b from-[#FF6A50] to-[#40D9FA] inline bg-black py-1.75 px-px md:py-2 4xl:px-0.5 ">
                  <span className="  ">
                    <span className="bg-[#04050F] py-1.5 md:py-1.75 px-0.75 4xl:px-2 ">
                      {children}
                    </span>
                  </span>
                </span>
              </strong>
            ),
          }}
        />
      </div>
      {/* Marquee */}
      <div className="mt-7 2xl:mt-10">
        <MarqueeLib speed={120} gradient={false}>
          {slice.primary.marquee.map((item, index) => (
            <div key={index} className="mx-4">
              <PrismicNextImage field={item.logo} className="h-6 w-auto" />
            </div>
          ))}
        </MarqueeLib>
      </div>
    </section>
  );
};

export default Marquee;
