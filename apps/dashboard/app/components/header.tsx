import { MenuIcon } from "lucide-react";
import { Button } from "@bifrost/ui/ui/button";
import { SignInButton } from "./sign-in-button";
import { User } from "~/services/auth.server";

type Props = {
  user?: User;
};
export function Header({ user }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <img src="/scotty.svg" alt="TartanHacks Logo" className="h-24 w-24" />
          <div className="flex flex-col">
            <h1 className="text-5xl font-bold text-[#991A30]">
              TartanHacks <span className="text-lg text-[#D82444]">by</span>{" "}
              <span className="text-[#D82444] text-4xl">Scottylabs</span>
            </h1>
            <p className="text-lg font-bold text-[#D82444]">Feb 7-8, 2025</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white md:hidden">
          <MenuIcon className="h-6 w-6" />
        </Button>
        <SignInButton user={user} />
      </div>
    </header>
  );
}
