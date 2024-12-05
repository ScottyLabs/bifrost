import { RegisterButton } from "./register";

export function Hero() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center flex-col">
      <div>
        <img src="/tartanhacks.svg" alt="logo" className="px-10" />
      </div>
      <div className="text-white text-center mt-8 font-thin font-futura">
        <h2 className="text-2xl">Presented by CMU ScottyLabs</h2>
        <p className="text-xl">Feb 7 — 8, 2025</p>
      </div>
      <div className="mt-10 mb-4">
        <RegisterButton />
      </div>
    </section>
  );
}
