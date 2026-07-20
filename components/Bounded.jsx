

const Bounded = ({ children, className = "", innerClassName = "" }) => {
  return (
    <section className={className}>
      <div
        className={`
          mx-auto w-full
       max-w-250
xl:max-w-7xl
2xl:max-w-360
 px-6 md:px-14 
          pb-20 md:pb-27 lg:pb-43
          ${innerClassName}
        `}
      >
        {children}
      </div>
    </section>
  );
};

export default Bounded;