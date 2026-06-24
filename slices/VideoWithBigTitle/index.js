import WistiaPlayer from "@/components/WistiaPlayer";
import { PrismicRichText } from "@prismicio/react";

/**
 * @typedef {import("@prismicio/client").Content.VideoWithBigTitleSlice} VideoWithBigTitleSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<VideoWithBigTitleSlice>} VideoWithBigTitleProps
 * @type {import("react").FC<VideoWithBigTitleProps>}
 */
const VideoWithBigTitle = ({ slice }) => {
  const previewVideoUrl = slice.primary.preview_video?.url ?? null;
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className=" max-w-[1920px] mx-auto w-full px-3 lg:px-9  mb-22.5 md:mb-45"
    >
      {/* Inner Container */}
      <div className="lg:px-15 xl:px-24 2xl:px-30 4xl:px-33.25 flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-30">
        {/* Left */}
        <div className="flex flex-col-reverse lg:flex-col justify-between lg:w-[50%] 2xl:w-[52%] 4xl:w-[52%]  ">
          <div className="text-white font-medium text-xl md:text-4xl 2xl:text-[60px] w-[80%] md:w-[65%] lg:w-full xl:w-[70%] 2xl:w-[90%] 4xl:w-[65%] leading-[1.1]">
            <PrismicRichText field={slice.primary.heading} />
          </div>
          <div className="mb-5 md:mb-7 lg:mb-0">
            <img
              className="w-20 md:w-25 lg:w-30 xl:w-35 h-auto"
              src="./devOps.png"
            />
          </div>
        </div>
        {/* Right */}
        <div className="lg:w-[40%]">
          {/* Video Player */}
          <div className="2xl:w-125.25 mb-8.5">
            <WistiaPlayer
              wistiaUrl={slice.primary.video_link.url}
              previewSrc={previewVideoUrl}
              // posterSrc={doc.data.preview_poster?.url}
            />
          </div>
          <div className="2xl:w-145 text-sm md:text-lg lg:text-sm 2xl:text-xl text-white">
            <PrismicRichText field={slice.primary.short_description} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoWithBigTitle;
