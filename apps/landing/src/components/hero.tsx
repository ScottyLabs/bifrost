import { RegisterButton } from "./register";

export function Hero() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center flex-col">
      <div className="z-30">
        <img src="/tartanhacks.svg" alt="tartanhacks" className="px-10" />
      </div>
      <div className="text-white text-center mt-8 font-thin font-futura z-30">
        <h2 className="text-2xl">Presented by CMU ScottyLabs</h2>
        <p className="text-xl">Feb 7 — 8, 2025</p>
      </div>
      <div className="mt-10">
        <RegisterButton />
      </div>
    </section>
  );
}
