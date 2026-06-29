"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

const titleComponents = {
  heading2: ({ children }) => (
    <span className="text-white text-sm lg:text-lg font-medium">
      {children}
    </span>
  ),
  paragraph: ({ children }) => (
    <p className="text-white/60 text-xs lg:text-sm leading-relaxed mt-1">
      {children}
    </p>
  ),
};

const descriptionComponents = {
  list: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  listItem: ({ children }) => <li className="mb-1">{children}</li>,
  oList: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  oListItem: ({ children }) => <li className="mb-1">{children}</li>,
};

const badgeComponents = {
  paragraph: ({ children }) => (
    <span className="text-[#3FD9FB] text-center text-[11px] lg:text-xs font-medium tracking-wide uppercase font-mono leading-none">
      {children}
    </span>
  ),
  image: ({ node }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={node.url} alt={node.alt || ""} className="h-4 w-5 object-fill" />
  ),
};

// Reusable speaker row
function SpeakerRow({
  image,
  name,
  linkedin,
  label,
  reserveLabelSpace = false,
}) {
  const hasLinkedIn = linkedin?.url;

  const renderName = () => {
    if (!name) return null;
    if (typeof name === "string")
      return <span className="text-white text-sm">{name}</span>;
    if (Array.isArray(name))
      return <span className="text-white text-sm">{name[0]?.text}</span>;
    if (typeof name === "object" && name.text !== undefined)
      return <span className="text-white text-sm">{name.text}</span>;
    return null;
  };

  return (
    <div className="flex items-center w-full  gap-2">
      <PrismicNextImage
        field={image}
        className={`w-12 h-12 rounded-full object-cover shrink-0 ${reserveLabelSpace && !label ? "mt-3.5" : ""}`}
      />
      <div className="flex flex-col">
        {reserveLabelSpace && (
          <span className="text-[#C9A84C] text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5 block min-h-3">
            {label || ""}
          </span>
        )}
        <div className="flex items-center gap-4">
          {renderName()}
          {hasLinkedIn && (
            <PrismicNextLink
              field={linkedin}
              onClick={(e) => e.stopPropagation()}
              className="text-white shrink-0"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="LinkedIn"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </PrismicNextLink>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgendaItem({ item, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const chevronRef = useRef(null);

  useEffect(() => {
    if (defaultOpen && contentRef.current) {
      gsap.set(contentRef.current, {
        display: "block",
        height: "auto",
        opacity: 1,
      });
      gsap.set(chevronRef.current, { rotation: 0 });
    } else {
      if (chevronRef.current) {
        gsap.set(chevronRef.current, { rotation: 180 });
      }
    }
  }, []);

  const hasDescription =
    item.short_description?.length > 0 &&
    item.short_description[0]?.text !== "";
  const hasSpeakers = item.speaker?.url;
  const hasSpeakerTwo = item.speaker_two?.url;
  const hasSpeakerThree = item.speaker_three_image?.url;
  const hasSpeakerFour = item.speaker_four_image?.url;
  const hasSpeakerFive = item.speaker_five_image?.url;
  const hasLinkedInOne = item.linkedinone?.url;
  const hasLinkedInTwo = item.linkedintwo?.url;
  const hasLinkedInThree = item.speaker_three_linkedin?.url;
  const hasLinkedInFour = item.speaker_four_linkedin?.url;
  const hasTitleOrImages =
    item.title_or_images?.length > 0 && item.title_or_images[0]?.text !== "";

  // Moderators
  const hasModeratorOne = item.moderator_one_image?.url;
  const hasModeratorTwo = item.moderator_two_image?.url;
  const hasModeratorThree = item.moderator_three_image?.url;
  const hasModeratorFour = item.moderator_four_image?.url;
  const hasAnyModerator =
    hasModeratorOne || hasModeratorTwo || hasModeratorThree || hasModeratorFour;

  // Facilitators
  const hasFacilitatorOne = item.facilitator_one_image?.url;
  const hasFacilitatorTwo = item.facilitator_two_image?.url;
  const hasFacilitatorThree = item.facilitator_three_image?.url;
  const hasFacilitatorFour = item.facilitator_four_image?.url;
  const hasAnyFacilitator =
    hasFacilitatorOne ||
    hasFacilitatorTwo ||
    hasFacilitatorThree ||
    hasFacilitatorFour;

  const isExpandable =
    hasDescription || hasSpeakers || hasAnyModerator || hasAnyFacilitator;

  const handleToggle = () => {
    if (!isExpandable) return;
    const content = contentRef.current;

    if (!isOpen) {
      gsap.set(content, { display: "block", height: 0, opacity: 0 });
      gsap.to(content, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(chevronRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => gsap.set(content, { display: "none" }),
      });
      gsap.to(chevronRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.in",
      });
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className="border-t font-sans border-white/10 mx-4 py-6">
      <div
        className="
          grid gap-x-4
          grid-cols-[auto_1fr_auto]
          lg:grid-cols-[5rem_1fr_auto_auto]
          items-center 
        "
      >
        {/* TIME + BADGE (mobile: stacked in col 1) */}
        <div className="flex flex-col items-start gap-2 row-start-1 ">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-[13px] lg:text-base pt-1">
              {item.time}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <div
          onClick={handleToggle}
          className="row-start-1 col-start-2 cursor-pointer"
        >
          <PrismicRichText field={item.title} components={titleComponents} />
        </div>

        {/* CHEVRON */}
        {isExpandable && (
          <div
            onClick={handleToggle}
            className="row-start-1 col-start-3 lg:col-start-3 lg:pt-1 flex items-center cursor-pointer"
          >
            <svg
              ref={chevronRef}
              width="14"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.349979 9.65005C-0.116798 9.18328 -0.116521 8.42634 0.349979 7.95939L7.95915 0.350187C8.42607 -0.11673 9.1829 -0.11673 9.64981 0.350187L17.2589 7.95939C17.7254 8.42633 17.7258 9.18327 17.2589 9.65005C16.7922 10.1168 16.0352 10.1165 15.5683 9.65005L8.80448 2.88622L2.04065 9.65005C1.57371 10.1165 0.816759 10.1168 0.349979 9.65005Z"
                fill="#3FD9FB"
              />
            </svg>
          </div>
        )}

        {/* EXPANDABLE CONTENT */}
        {isExpandable && (
          <div
            ref={contentRef}
            className="hidden overflow-hidden row-start-2 col-start-1 col-end-4 lg:col-start-2 lg:col-end-3"
          >
            <div className=" flex flex-col gap-4 mt-2">
              {/* Description */}
              {hasTitleOrImages && (
                <div className="flex row-start-1 col-start-4  shrink-0 items-start">
                  <div
                    style={{ border: "2px solid #3FD9FB" }}
                    className="inline-flex items-center mt-3 justify-center gap-2.5 rounded-full px-5 py-1.5  text-[#3FD9FB] text-xs font-medium min-h-8"
                  >
                    <PrismicRichText
                      field={item.title_or_images}
                      components={badgeComponents}
                    />
                  </div>
                </div>
              )}
              {hasDescription && (
                <div className="text-white/60 text-xs md:text-sm leading-relaxed">
                  <PrismicRichText
                    field={item.short_description}
                    components={descriptionComponents}
                  />
                </div>
              )}

              {/* Speakers */}
              {hasSpeakers && (
                <div className="flex flex-col w-full xl:grid xl:grid-cols-2 xl:items-center gap-4 lg:gap-4">
                  {hasSpeakers && (
                    <SpeakerRow
                      image={item.speaker}
                      name={item.speaker_name}
                      linkedin={item.linkedinone}
                      label={""}
                    />
                  )}
                  {hasSpeakerTwo && (
                    <SpeakerRow
                      image={item.speaker_two}
                      name={item.speaker_two_name}
                      linkedin={item.linkedintwo}
                    />
                  )}
                  {hasSpeakerThree && (
                    <SpeakerRow
                      image={item.speaker_three_image}
                      name={item.speaker_three_name}
                      linkedin={item.speaker_three_linkedin}
                    />
                  )}
                  {hasSpeakerFour && (
                    <SpeakerRow
                      image={item.speaker_four_image}
                      name={item.speaker_four_name}
                      linkedin={item.speaker_four_linkedin}
                    />
                  )}
                  {hasSpeakerFive && (
                    <SpeakerRow
                      image={item.speaker_five_image}
                      name={item.speaker_five_name}
                      linkedin={item.speaker_five_linkedin}
                    />
                  )}
                </div>
              )}
              {/* Separator - only when speakers and moderator/facilitator both exist */}
              {hasSpeakers && (hasAnyModerator || hasAnyFacilitator) && (
                <div className="w-46 h-[0.5px] bg-white/20" />
              )}
              {/* Moderators */}
              {hasAnyModerator && (
                <div>
                  <div className="flex flex-col w-full xl:flex-row xl:items-center gap-3   xl:gap-10">
                    {hasModeratorOne && (
                      <SpeakerRow
                        image={item.moderator_one_image}
                        name={item.moderator_one_name}
                        linkedin={item.moderator_one_linkedin}
                        label="Moderator"
                        reserveLabelSpace
                      />
                    )}
                    {hasModeratorTwo && (
                      <SpeakerRow
                        image={item.moderator_two_image}
                        name={item.moderator_two_name}
                        linkedin={item.moderator_two_linkedin}
                        reserveLabelSpace
                      />
                    )}
                    {hasModeratorThree && (
                      <SpeakerRow
                        image={item.moderator_three_image}
                        name={item.moderator_three_name}
                        linkedin={item.moderator_three_linkedin}
                        reserveLabelSpace
                      />
                    )}
                    {hasModeratorFour && (
                      <SpeakerRow
                        image={item.moderator_four_image}
                        name={item.moderator_four_name}
                        linkedin={item.moderator_four_linkedin}
                        reserveLabelSpace
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Facilitators */}
              {hasAnyFacilitator && (
                <div className="">
                  <div className="flex flex-col w-full xl:flex-row xl:items-center gap-3 xl:gap-10">
                    {hasFacilitatorOne && (
                      <SpeakerRow
                        image={item.facilitator_one_image}
                        name={item.facilitator_one_name}
                        linkedin={item.facilitator_one_linkedin}
                        label="Facilitator"
                        reserveLabelSpace
                      />
                    )}
                    {hasFacilitatorTwo && (
                      <SpeakerRow
                        image={item.facilitator_two_image}
                        name={item.facilitator_two_name}
                        linkedin={item.facilitator_two_linkedin}
                        reserveLabelSpace
                      />
                    )}
                    {hasFacilitatorThree && (
                      <SpeakerRow
                        image={item.facilitator_three_image}
                        name={item.facilitator_three_name}
                        linkedin={item.facilitator_three_linkedin}
                        reserveLabelSpace
                      />
                    )}
                    {hasFacilitatorFour && (
                      <SpeakerRow
                        image={item.facilitator_four_image}
                        name={item.facilitator_four_name}
                        linkedin={item.facilitator_four_linkedin}
                        reserveLabelSpace
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
