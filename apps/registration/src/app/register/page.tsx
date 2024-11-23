import { Logo } from "~/components/ui/logo";
import { Card, CardContent, CardTitle } from "@bifrost/ui/ui/card";
import { RegisterForm } from "~/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-8">
          <Logo className="h-12" />
          <CardTitle className="text-2xl font-medium">
            Create an Account
          </CardTitle>
        </div>
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="space-y-6">
            <RegisterForm />

            <div className="text-center text-sm">
              <Link
                href="/auth/signin"
                className="text-muted-foreground hover:text-primary"
              >
                Have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
