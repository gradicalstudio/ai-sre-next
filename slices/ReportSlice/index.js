import HeroButton from "@/components/HeroButton";
import ReportButton from "@/components/ReportButton";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.ReportSliceSlice} ReportSliceSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ReportSliceSlice>} ReportSliceProps
 * @type {import("react").FC<ReportSliceProps>}
 */
const ReportSlice = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45"
    >
      <div className="text-white flex flex-col items-center justify-center">
        {/* Image */}
        <div>
          <PrismicNextImage field={slice.primary.asset} />
        </div>
        {/* Heading */}
        <div className="text-[38px] md:text-[40px] lg:text-[42px] xl:text-[50px] leading-none text-center font-medium my-4 md:my-4 lg:my-5 xl:my-7">
          <PrismicRichText field={slice.primary.heading} />
        </div>
        {/* Description */}
        <div className="text-sm xl:text-lg md:text-base 2xl:text-xl md:max-w-150 lg:max-w-155 xl:max-w-173  2xl:max-w-175 mx-auto text-center">
          <PrismicRichText field={slice.primary.description} />
        </div>
        {/* Email input field */}
        <div className="xl:max-w-173 2xl:max-w-175 md:max-w-150 lg:max-w-155 w-full mx-auto mt-9 mb-4 md:mt-10 md:mb-4 lg:mt-12 lg:mb-4 2xl:mt-14 xl:mt-13 xl:mb-4 ">
          <div className="flex w-full">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-full bg-white px-3 py-2 md:px-6 md:py-3 text-black text-sm md:text-base placeholder-black outline-none"
            />
            <ReportButton
              buttonText="Register"
              innerClassName="2xl:text-base! xl:text-[15px]!"
            />
          </div>
        </div>
        <div className="text-xs 2xl:text-sm  xl:max-w-173 md:max-w-150 lg:max-w-155 2xl:max-w-175 mx-auto text-center">
          <PrismicRichText
            field={slice.primary.subscription_info}
            components={{
              hyperlink: ({ node, children }) => (
                <a
                  href={node.data.url}
                  target={node.data.target}
                  className="underline underline-offset-2"
                >
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ReportSlice;
