import VideoPlayer from "@/components/VIdeoplayer";
import { PrismicRichText } from "@prismicio/react";
// import VideoPlayer from "./VideoPlayer";

/**
 * @typedef {import("@prismicio/client").Content.VideoShowcaseSlice} VideoShowcaseSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<VideoShowcaseSlice>} VideoShowcaseProps
 * @type {import("react").FC<VideoShowcaseProps>}
 */
const VideoShowcase = ({ slice }) => {
  const items = slice.primary?.videoblocks ?? [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9 h-auto mb-22.5 md:mb-45"
    >
      {/* Heading + Description — server rendered, zero JS */}
      <div>
        <div className=" mb-10 max-w-2xl mx-auto">
          {slice.primary?.heading && (
            <div className="text-white text-xl md:text-4xl font-medium leading-tight mb-3 [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0">
              <PrismicRichText field={slice.primary.heading} />
            </div>
          )}
          {slice.primary?.description && (
            <div className="text-white/50 w-[90%] text-xs md:text-base leading-[1.2] [&_p]:m-0">
              <PrismicRichText field={slice.primary.description} />
            </div>
          )}
        </div>
      </div>

      {/* Hand off to the client boundary — only this part ships JS */}
      <div className="lg:px-15 xl:px-24 2xl:px-30 4xl:px-40  ">
        <VideoPlayer items={items} />
      </div>
    </section>
  );
};

export default VideoShowcase;
