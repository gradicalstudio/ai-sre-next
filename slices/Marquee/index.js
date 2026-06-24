import { PrismicRichText } from "@prismicio/react";

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
      className="hidden"
    >
      <div className="text-white">
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            strong: ({ children }) => (
              <strong className="font-mono p-1  font-medium text-white not-italic">
                <span className="bg-linear-to-b from-[#FF6A50] to-[#40D9FA] inline bg-black p-px">
                  <span className="bg-black ">{children}</span>
                </span>
              </strong>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default Marquee;
