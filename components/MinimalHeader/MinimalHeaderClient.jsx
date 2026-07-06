"use client";

import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import Link from "next/link";

const ArrowIcon = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M8.67057 16.6676H6.00391V14.001H8.67057V16.6676Z" fill="white" />
    <path d="M11.3307 13.9997H8.66406V11.333H11.3307V13.9997Z" fill="white" />
    <path d="M14.0026 11.3337H11.3359V8.66699H14.0026V11.3337Z" fill="white" />
    <path d="M8.67057 11.3337H6.00391V8.66699H8.67057V11.3337Z" fill="white" />
    <path d="M11.3307 8.66569H8.66406V5.99902H11.3307V8.66569Z" fill="white" />
    <path d="M8.67057 5.99967H6.00391V3.33301H8.67057V5.99967Z" fill="white" />
  </svg>
);

const ArrowAsset = ({ arrowAssetClass }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={arrowAssetClass}
  >
    <path d="M4.19657 8.06376H2.90625V6.77344H4.19657V8.06376Z" fill="#FF6A50" />
    <path d="M5.48564 6.77274H4.19531V5.48242H5.48564V6.77274Z" fill="white" />
    <path d="M6.7786 5.48368H5.48828V4.19336H6.7786V5.48368Z" fill="#FF6A50" />
    <path d="M4.19657 5.48173H2.90625V4.19141H4.19657V5.48173Z" fill="white" />
    <path d="M5.48564 4.19267H4.19531V2.90234H5.48564V4.19267Z" fill="#FF6A50" />
    <path d="M4.19657 2.90165H2.90625V1.61133H4.19657V2.90165Z" fill="white" />
  </svg>
);

const MinimalHeaderClient = ({ brand_logo, nav_cta }) => {
  return (
    <header className="sticky top-0 z-350 bg-[#04050F] text-white">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-9 h-16 lg:h-15">
        
        {/* Logo — clicks back to homepage */}
        <Link href="/">
          <PrismicNextImage field={brand_logo} className="h-8 lg:h-8 w-auto cursor-pointer" />
        </Link>

        {/* CTA — desktop */}
        <div className="hidden lg:block">
          <PrismicNextLink
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#242424] hover:bg-white/20 transition-colors text-sm font-medium px-4 py-2 rounded-full"
          >
            {nav_cta?.text || "Register for Meetup"}
            <span className="text-[#FF6A50]">
              <ArrowIcon className="size-4 mt-0.5" />
            </span>
          </PrismicNextLink>
        </div>

        {/* CTA — mobile */}
        <div className="flex lg:hidden items-center">
          <PrismicNextLink
            field={nav_cta}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium"
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