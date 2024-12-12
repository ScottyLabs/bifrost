import { Button } from "@bifrost/ui/ui/button";

import { Form } from "@remix-run/react";
import { LogIn, LogOut } from "lucide-react";
import { User } from "~/services/auth.server";

type Props = {
  user?: User;
};
export function SignInButton({ user }: Props) {
  if (!user) {
    return (
      <Form method="POST" action="/auth/login">
        <Button className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </Form>
    );
  }

  return (
    <Form method="POST" action="/auth/logout">
      <Button variant="outline" type="submit" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </Form>
  );
}
