const OldPrimaryButton = ({ buttonText, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${className}
          rounded-full
          bg-white
          px-10
          py-3
          
          text-[12px]
          md:text-xs
          lg:text-sm
          xl:text-base
          font-semibold
          text-black

          transition-color
          duration-450

          hover:bg-[#FF6A50]
          hover:text-[#04050F]
          hover:cursor-pointer
    
        `}
    >
      {buttonText}
    </button>
  );
};

export default OldPrimaryButton;
