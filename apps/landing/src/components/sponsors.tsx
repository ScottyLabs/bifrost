export function Sponsors() {
  return (
    <section
      className="flex flex-col justify-center items-center pb-24"
      id="sponsors"
    >
      <hr className="h-px my-8 w-3/4 md:w-2/3 bg-white border-0" />
      <h1 className="mt-24 px-10 uppercase font-basteleur text-5xl md:text-8xl z-30">
        Sponsors
      </h1>
      <img src="/sponsors/applovin.svg" alt="applovin" className="px-8 w-" />
      <div className="flex flex-wrap w-full justify-center items-center space-y-12 z-30">
        <img src="/sponsors/stripe.svg" alt="stripe" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/jane.svg" alt="jane" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/sandia.svg" alt="sandia" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/hrt.svg" alt="hrt" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/cylab.svg" alt="jane" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/storyprotocol.svg" alt="hrt" className="px-8 w-48 md:w-64" />
        <img src="/sponsors/ripple.svg" alt="sandia" className="px-8 w-48 md:w-64" />
      </div>
    </section>
  );
}
