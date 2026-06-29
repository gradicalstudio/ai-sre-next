"use client";

import { useState } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import VideoPlayerOld from "@/components/VideoPlayerOld";
import OldPrimaryButton from "@/components/OldPrimaryButton";
/**
 * @typedef {import("@prismicio/client").Content.OldHeroSectionSlice} OldHeroSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<OldHeroSectionSlice>} OldHeroSectionProps
 * @type {import("react").FC<OldHeroSectionProps>}
 */
const OldHeroSection = ({ slice }) => {
  // const [isSpeakerOpen, setIsSpeakerOpen] = useState(false);

  const showVideo = slice.primary.video_toggle;
  // const handleCalendar = () => {
  //   window.open(
  //     "https://calendar.google.com/calendar/render?action=TEMPLATE&text=AI+SRE+Next&dates=20260612T100000/20260612T153000&details=Join+AI+SRE+Next&location=Conrad+Bengaluru,+25/3,+Kensington+Rd,+Halasuru,+Someshwarpura,+Bengaluru,+Karnataka+560008,+India",
  //     "_blank",
  //   );
  // };

  return (
    <>
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="w-full bg-[#04050F]  px-6 md:px-6 
          pt-4 md:pt-10 lg:pb-0  flex  overflow-hidden w-full max-w-[1000px] xl:max-w-[1280px] 2xl:max-w-[1440px] px-6 md:px-14  mx-auto flex-col gap-6 text-white   "
      >
        <img
          src="/Old Final Logo.svg"
          alt="Logo"
          className="h-auto w-18 md:w-24 xl:w-44 object-contain"
        />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 xl:gap-15 ">
          {/* Left Side */}
          <div className="lg:w-[50%] xl:w-[50%] flex flex-col justify-between ">
            <div className="block pb-5 md:hidden ">
              <div className="w-full rounded-2xl">
                <VideoPlayerOld />
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              {/* Heading */}
              <div className="max-w-4xl text-4xl md:text-5xl lg:text-[50px] xl:text-5xl 2xl:text-[65px] font-medium lg:leading-[1.1] xl:leading-[1]">
                <PrismicRichText
                  field={slice.primary.heading}
                  components={{
                    strong: ({ children }) => (
                      <span className="text-[#3FD9FB]">{children}</span>
                    ),
                  }}
                />
              </div>

              {/* Description */}
              <div className="max-w-2xl  font-medium text-base lg:text-lg xl:text-lg 2xl:text-lg text-balance ">
                <PrismicRichText field={slice.primary.description} />
              </div>
              <div className="mt-6 flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-3 xl:gap-6">
                <PrismicNextLink field={slice.primary.cta_link}>
                  <OldPrimaryButton
                    className=" text-[12px]! md:text-[14px]! xl:text-[16px]!  w-full! md:w-fit!  md:px-8! md:py-3! lg:px-5! text-nowrap  lg:py-3! xl:py-3! xl:px-9!  "
                    buttonText="Register For Upcoming AI SRE Meet Up"
                  />
                </PrismicNextLink>
              </div>
              <div className="hidden md:block lg:hidden pb-5 mt-4">
                <div className="w-full rounded-2xl">
                  <VideoPlayerOld />
                </div>
              </div>
            </div>

            {/* Buttons */}

            {/* Meta Info */}
            {/*
<div className="flex mt-10 flex-col w-full">
  <div className="flex flex-wrap items-center gap-5 lg:gap-3 xl:gap-5 w-full lg:w-[95%] xl:w-full">

    <div className="flex text-center items-center gap-2 group">
      <img src="/calender.svg" />
      <p>{slice.primary.date_text}</p>
    </div>

    <div className="flex items-center gap-2">
      <img src="/clock.svg" />
      <p>{slice.primary.time}</p>
    </div>

    <div className="flex items-center z-10 gap-2">
      <img src="/Location pin.svg" />
      <PrismicNextLink field={slice.primary.location} />
    </div>

  </div>
</div>
*/}
          </div>

          {/* Right Side Video */}
          <div className="hidden lg:flex flex-1 items-center rounded-2xl lg:justify-center">
            <div className="w-full z-40 rounded-2xl">
              <VideoPlayerOld />
            </div>
          </div>
        </div>
      </section>
      {/* <div className="relative  inset-x-0  lg:mt-5 xl:mt-0 h-8 lg:h-30 xl:h-70  ">
       
       
        <div className=" hidden lg:block absolute  -top-10 md:-top-3 lg:-top-64 xl:-top-35 inset-x-0 bottom-0 z-10 opacity-65 pointer-events-none">
          <img
            className="scale-[1.15] h-[130%]  md:w-[105%]  md:h-[130%] xl:h-full object-cover mask-image:linear-gradient(to_bottom,transparent_0%,transparent_60%,black_45%,black_100%)] md:[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_0%,black_45%,black_100%)] lg:[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_45%,black_55%,black_100%)] xl:[mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,black_55%,black_100%)]"
            src="/toplayer.svg"
            alt="texture"
          />
        </div>
      </div> */}
    </>
  );
};

export default OldHeroSection;
