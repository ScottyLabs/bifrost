import { auth } from "~/lib/auth";
import { SignInButton } from "~/components/auth/SignInButton";
import { Avatar, AvatarFallback, AvatarImage } from "@bifrost/ui/ui/avatar";
import { Button } from "@bifrost/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bifrost/ui/ui/card";

import {
  SettingsIcon,
  ShieldIcon,
  LayoutDashboardIcon,
} from "@bifrost/ui/components/icons";

import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Welcome to Bifrost
          </CardTitle>
          <CardDescription>
            {session?.user
              ? "Manage your account and access your dashboard"
              : "Sign in to get started with Bifrost"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {session?.user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name?.slice(0, 2).toUpperCase() ?? "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-semibold">{session.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <ShieldIcon className="mx-auto h-12 w-12 text-slate-800" />
              <p className="text-sm text-muted-foreground">
                Access your dashboard, manage projects, and more.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <SignInButton />
        </CardFooter>
      </Card>
    </main>
  );
}
