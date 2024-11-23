import { Button } from "@bifrost/ui/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { auth, signIn, signOut } from "~/lib/auth";

export async function SignInButton() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("bifrost");
        }}
      >
        <Button className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </form>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button variant="outline" type="submit" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </form>
  );
}
