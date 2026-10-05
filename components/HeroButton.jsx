"use client";

import { useRef } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { getHashId } from "@/lib/nav";
import HoverArrowIcon from "./HoverArrowIcon";

const HeroButton = ({ link, buttonText }) => {
  const arrowRef = useRef(null);

  const hashId = getHashId(link);

  const handleClick = (e) => {
    if (!hashId) return;
    e.preventDefault();
    const target = document.getElementById(hashId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="group bg-[#FF6A50] lg:bg-[#04050F] w-fit transition-color duration-300 lg:hover:bg-[#FF6A50] inline-flex md:w-fit cursor-pointer items-center rounded-sm px-2 py-1 lg:px-3 lg:py-[6.5px]"
      onMouseEnter={() => arrowRef.current?.animate(true)}
      onMouseLeave={() => arrowRef.current?.animate(false)}
    >
      <PrismicNextLink
        field={link}
        onClick={handleClick}
        className="text-white lg:border w-fit md:w-fit rounded-full pl-2.5 pr-1.5 py-2.5 lg:pl-4 lg:pr-2.5 lg:py-2 flex items-center group-hover:border-[#FF6A50]  bg-[#04050F] transition-color duration-300"
      >
        <div className="flex items-center justify-center text-xs md:text-base gap-1 md:gap-2 w-full">
          <span>{buttonText ?? link.text}</span>
          <HoverArrowIcon
            ref={arrowRef}
            offset={20}
            className="relative inline-block overflow-hidden size-3.5 md:size-5"
            iconClassName="absolute inset-0 size-3.5 md:size-5"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      </PrismicNextLink>
    </div>
  );
};

export default HeroButton;
