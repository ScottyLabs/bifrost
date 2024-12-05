export function Theme() {
  return (
    <section
      className="flex flex-col text-center text-white m-auto border-b-4 text-xl py-36 items-center"
      id="theme"
    >
        <h3 className="mt-16 text-4xl md:text-5xl font-bold">
          This year's theme is...
        </h3>
        <h1 className="mt-8 px-10 uppercase font-basteleur text-7xl md:text-8xl">
          Changing Tides
        </h1>
      <div className="w-2/3 md:w-1/2">
        <p className="mt-12">
          Take your most swashbuckling of crewmates along as you steer your team toward waters unknown!
        </p>
        <p className="mt-8">
          For 24 hours, you are out on the open ocean. There is a stir in the wind… something brewing. All will be
          uprooted and start anew. Let the waves wash away everything that came before, leaving you with nothing but your
          ingenuity and companions as you search for hidden treasure!
        </p>
      </div>
    </section>
  );
}
