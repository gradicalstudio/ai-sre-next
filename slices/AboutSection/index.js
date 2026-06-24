import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.AboutSectionSlice} AboutSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AboutSectionSlice>} AboutSectionProps
 * @type {import("react").FC<AboutSectionProps>}
 */
const AboutSection = ({ slice }) => {
  return (
    // Main Container
    <section
      id="about"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 md:px-6 lg:px-9 mb-22.5 md:mb-45"
    >
      {/* Inner Container */}
      <div className="lg:px-15 xl:px-24 2xl:px-30 4xl:px-33.25">
        {/* Top */}
        <div className="text-base md:text-[26px] lg:text-[28px] xl:text-[34px] 2xl:text-[36px] 4xl:text-[44px] text-white md:leading-[1.1] lg:leading-none lg:w-[84%] xl:w-[84%] 2xl:w-[84%] 4xl:w-[84%] mb-12.5 md:mb-27 lg:mb-27 xl:mb-35  2xl:mb-45">
          <PrismicRichText field={slice.primary.intro_text} />
        </div>
        {/* Bottom */}
        <div>
          {/* Cards */}
          <div className="  text-white flex flex-col md:flex-row md:gap-15 lg:gap-15 2xl:gap-24 4xl:gap-30 ">
            {slice.primary.overview_cards.map((item, i) => (
              <div
                key={i}
                className="  md:w-95 lg:w-100 xl:w-115 2xl:w-113 4xl:w-120"
              >
                <div>
                  {/* Line */}
                  {i !== 0 && (
                    <div className="sm:hidden w-full h-px my-5 bg-[#A2A2A2]" />
                  )}

                  <div className="mb-4 md:mb-6 lg:mb-7.5 2xl:mb-9.5 h-auto w-20 md:w-20 lg:w-25 xl:w-30 ">
                    <PrismicNextImage field={item.icon} className="" />
                  </div>
                  <div className="text-xl lg:text-[22px] xl:text-[26px] 4xl:text-[28px]">
                    <PrismicRichText field={item.title} />
                  </div>
                  <div className=" mt-3 lg:mt-4 text-sm md:text-xs md:tracking-wide lg:text-sm 4xl:text-base text-[#A2A2A2] text-pretty ">
                    <PrismicRichText field={item.description} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
