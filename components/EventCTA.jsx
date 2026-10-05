"use client";

import { useRef } from "react";
import { PrismicNextLink } from "@prismicio/next";
import HoverArrowIcon from "./HoverArrowIcon";

const EventCTA = ({
  link,
  outerClassName,
  innerClassName,
  prismicLinkClassName,
  arrowClassName,
}) => {
  const arrowRef = useRef(null);

  return (
    <div
      className={`group bg-[#FF6A50] lg:bg-[#04050F] w-fit transition-color duration-450  lg:hover:bg-[#FF6A50] inline-flex  md:w-fit cursor-pointer items-center justify-center  rounded-xs px-2 py-1 lg:px-3 lg:py-[6.5px]${outerClassName} `}
      onMouseEnter={() => arrowRef.current?.animate(true)}
      onMouseLeave={() => arrowRef.current?.animate(false)}
    >
      <PrismicNextLink
        field={link}
        className={`text-white w-fit md:w-fit rounded-full pl-4 pr-2.5 py-1 lg:pl-4 lg:pr-2.5 lg:py-2 flex items-center  bg-[#04050F] ${prismicLinkClassName}`}
      >
        <div
          className={`flex items-center justify-center text-xs md:text-sm lg:text-base  gap-1 md:gap-2 w-full ${innerClassName}`}
        >
          <span>{link.text}</span>
          <HoverArrowIcon
            ref={arrowRef}
            offset={20}
            className={`relative inline-block overflow-hidden size-4 md:size-4 lg:size-5 ${arrowClassName}`}
            iconClassName="absolute inset-0 size-full"
          />
        </div>
      </PrismicNextLink>
    </div>
  );
};

export default EventCTA;
