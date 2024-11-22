import { RegisterButton } from "./register";

export function Hero() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center flex-col">
      <div>
        <h1 className="uppercase font-extrabold  text-6xl sm:text-8xl md:text-9xl font-futura text-transparent bg-gradient-to-r bg-clip-text from-[#1EB2F8] via-[#53DAF8] to-red text-center">
          Tartanhacks 2025
        </h1>
      </div>
      <div className="text-white text-center mt-8 font-thin font-futura">
        <h2 className="text-2xl">CMU&apos;s Largest Hackathon</h2>
        <p className="text-xl">Feb 7—8, 2025</p>
      </div>
      <div className="mt-10 mb-4">
        <RegisterButton />
      </div>
    </section>
  );
}
