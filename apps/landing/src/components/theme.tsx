export function Theme() {
  return (
    <section
      className="text-center text-white m-auto border-b-4 text-xl py-36"
      id="theme"
    >
      <h3 className="mt-16 text-5xl md:text-6xl font-bold">
        This year's theme...
      </h3>
      <div className="my-12 relative w-full h-[15vh] md:h-[20vh] lg:h-[30vh]">
        <img
          src="/under-construction.svg"
          alt="Under Construction"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <h3 className="mt-16 text-5xl md:text-6xl font-bold">
        Our previous theme...
      </h3>
      <div className="my-16 relative w-full h-[15vh] md:h-[20vh] lg:h-[30vh]">
        <img
          src="/amplify.svg"
          alt="Amplify"
          className="absolute inset-0 h-full object-cover mx-auto"
        />
      </div>
    </section>
  );
}
