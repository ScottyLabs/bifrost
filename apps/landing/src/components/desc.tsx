import { DeadlineCountdown } from "./countdown";
import { RegisterButton } from "./register";

export function Desc() {
  return (
    <section
      className="flex flex-col justify-center items-center min-h-screen"
      id="about"
    >
      <hr className="h-px my-8 w-3/4 md:w-2/3 bg-white border-0 z-30" />
      <div className="text-white text-center text-xl font-sfpro w-2/3 md:w-1/2 z-30">
        <p>
          <span className="uppercase font-basteleur">Tartanhacks </span>
          is the largest Hackathon in Pittsburgh! Organized by ScottyLabs, it’s a 24-hour in person hackathon where participants
          from all over the country create innovative projects.
          Come on over to hack, connect with peers, and learn from our incredible speakers. This year, we are excited to offer a select number of travel reimbursements. The application deadline for travel reimbursement is in
        </p>
        <DeadlineCountdown />
        <RegisterButton />
      </div>
      <hr className="h-px my-8 w-3/4 md:w-2/3 bg-white border-0 z-30" />
    </section>
  );
}
