import ArrowDown from "@/components/ArrowDownIcon";
import HeroButton from "@/components/HeroButton";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.HeroSectionSlice} HeroSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<HeroSectionSlice>} HeroSectionProps
 * @type {import("react").FC<HeroSectionProps>}
 */
const HeroSection = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45"
    >
      {/* Main container */}
      <div className=" w-full h-full">
        {/* iframe container */}
        <div className="w-full mb-10 lg:mb-19.5">
          <iframe
            src="https://www.unicorn.studio/embed/2wYzUuTwklWbYOVWOlkR"
            className="w-full h-30 lg:h-95 xl:h-75"
            allowFullScreen
          />
        </div>
        {/* Contents */}
        <div className="text-white flex flex-col lg:flex-row lg:gap-25 2xl:gap-49 4xl:gap-58 ">
          {/* left */}
          <div className="md:w-[70%] 2xl:w-[59%] 4xl:w-[58%] flex flex-col lg:gap-25 justify-between mb-5 md:mb-7 lg:mb-0">
            <div className="text-[2.375rem] md:text-6xl lg:text-[66px] 2xl:text-[86px]  4xl:text-[6.375rem] leading-none lg:leading-[0.9]">
              <PrismicRichText field={slice.primary.heading} />
            </div>
            <div className=" hidden lg:block uppercase font-mono text-[#3ED4F5]">
              <p>AI SRE Community by StackGen</p>
            </div>
          </div>
          {/* right */}
          <div className="flex lg:w-[49%] flex-col 4xl:gap-35 justify-between">
            <div className="flex flex-col lg:gap-14">
              <div className="md:w-[60%]  lg:w-[80%] 4xl:w-[80%] mb-5 md:mb-7 lg:mb-0 text-sm md:text-base lg:text-lg 4xl:text-xl">
                <PrismicRichText field={slice.primary.description} />
              </div>
              <div>
                <HeroButton link={slice.primary.cta_button} />
              </div>
            </div>
            <div className="hidden lg:mt-20 lg:flex justify-between font-mono text-[#3ED4F5] items-center uppercase">
              <p>Scroll down</p>
              <span>
                <ArrowDown />
              </span>
            </div>
          </div>
        </div>
        {/* Filler  */}
        <div className=" mt-5 md:mt-7 lg:hidden flex text-xs font-mono items-center justify-between w-full ">
          <div className="  uppercase font-mono  text-[#3ED4F5]">
            <p>AI SRE Community by StackGen</p>
          </div>
          <div className="flex gap-2 font-mono text-[#3ED4F5] items-center uppercase">
            <p>Scroll down</p>
            <span>
              <ArrowDown />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
