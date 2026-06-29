import { PrismicNextLink } from "@prismicio/next";

const ModalButtons = ({ className, field, buttonText }) => {
  const buttonClass = `
    ${className}
    inline-flex items-center gap-2
    rounded-full
    bg-[#FF6A50]
    px-7
    py-3
    text-[12px]
    md:text-xs
    lg:text-sm
    xl:text-base
    font-semibold
    text-[#04050F]
    transition-all
    duration-250
    hover:brightness-110
    hover:cursor-pointer
  `;

  return (
    <PrismicNextLink field={field} className={buttonClass}>
      {buttonText}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.71826 11.4071L9.44721 6.67817L4.71826 1.94922" stroke="#281638" strokeWidth="0.83452" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </PrismicNextLink>
  );
};

export default ModalButtons;