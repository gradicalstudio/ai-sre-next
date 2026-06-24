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
              <strong className="font-mono font-medium text-white not-italic">
                <div className="bg-linear-to-b from-[#FF6A50] to-[#40D9FA] inline p-1">
                  {children}
                </div>
              </strong>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default Marquee;
