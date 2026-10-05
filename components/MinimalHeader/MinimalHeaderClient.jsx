"use client";

import { useRef } from "react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from "next/link";
import HoverArrowIcon from "../HoverArrowIcon";
import ArrowAsset from "../ArrowAsset";

const MinimalHeaderClient = ({ brand_logo, nav_cta }) => {
  const arrowRef = useRef(null);

  return (
    <header className="sticky top-0 z-350 bg-[#04050F] text-white">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-9 h-16 lg:h-15">
        {/* Logo */}
        <Link
          href="/"
          className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
        >
          <PrismicNextImage field={brand_logo} className="h-8 lg:h-8 w-auto cursor-pointer" />
        </Link>

        {/* CTA — desktop */}
        <div className="hidden lg:block">
          <PrismicNextLink
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => arrowRef.current?.animate(true)}
            onMouseLeave={() => arrowRef.current?.animate(false)}
            className="flex items-center gap-1.5 bg-[#242424] hover:bg-white/20 transition-colors text-sm font-medium px-4 py-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
          >
            {nav_cta?.text || "Register for Meetup"}
            <HoverArrowIcon
              ref={arrowRef}
              offset={16}
              className="relative inline-block overflow-hidden size-4 mt-0.5 text-[#FF6A50]"
              iconClassName="absolute inset-0 size-full"
            />
          </PrismicNextLink>
        </div>

        {/* CTA — mobile */}
        <div className="flex lg:hidden items-center">
          <PrismicNextLink
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3FD9FB]"
          >
            {nav_cta?.text || "Register for Meetup"}
            <span className="text-[#FF6A50]">
              <ArrowAsset arrowAssetClass="size-4 mt-px" />
            </span>
          </PrismicNextLink>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeaderClient;
