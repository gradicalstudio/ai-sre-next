"use client";

import { forwardRef, useRef } from "react";
import { PrismicNextLink } from "@prismicio/next";
import HoverArrowIcon from "../HoverArrowIcon";

const NavCtaButton = forwardRef(function NavCtaButton(
  { field, children, className = "" },
  outerRef,
) {
  const arrowRef = useRef(null);

  return (
    <div ref={outerRef} className={className}>
      <PrismicNextLink
        field={field}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => arrowRef.current?.animate(true)}
        onMouseLeave={() => arrowRef.current?.animate(false)}
        className="flex items-center gap-1.5 bg-[#242424] hover:bg-white/20 transition-colors text-sm font-medium px-4 py-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB] touch-manipulation"
      >
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
        <HoverArrowIcon
          ref={arrowRef}
          offset={16}
          className="relative inline-block overflow-hidden size-4 mt-0.5 text-[#FF6A50]"
          iconClassName="absolute inset-0 size-full"
        />
      </PrismicNextLink>
    </div>
  );
});

export default NavCtaButton;
