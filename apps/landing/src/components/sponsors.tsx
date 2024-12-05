export function Sponsors() {
  return (
    <section
      className="flex flex-col justify-center items-center pb-80"
      id="sponsors"
    >
      <hr className="h-px my-8 w-3/4 md:w-2/3 bg-white border-0" />
      <h1 className="mt-24 px-10 uppercase font-basteleur text-5xl md:text-8xl">
        Sponsors
      </h1>
      <div className="flex mt-16 space-x-16">
        <img src="/sponsors/stripe.svg" alt="stripe" />
        <img src="/sponsors/jane.svg" alt="jane" />
        <img src="/sponsors/sandia.svg" alt="sandia" />
        <img src="/sponsors/hrt.svg" alt="hrt" />
      </div>
    </section>
  );
}
