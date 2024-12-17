"use client";

import { Button } from "@bifrost/ui/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@bifrost/ui/ui/card";

import { components, paths } from "@bifrost/lib/api/v1";

type UserStatus = components["schemas"]["User"]["status"];

function StatusMap({ status }: { status: UserStatus }) {
  switch (status) {
    case "UNVERIFIED":
      return (
        <h3 className="text-xl font-bold text-[#02435F]">
          You still need to complete your application!
        </h3>
      );
  }
}

type StatusCardProps = {
  application: components['schemas']['Application'];
  me: components['schemas']['User'];
};
export function StatusCard({ application, me }: StatusCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm from-white/85 to-[#B1E2F6]/85 bg-gradient-to-br">
      <CardHeader className="text-center space-y-10">
        <h2 className="text-3xl font-bold text-[#02435F]">Your status:</h2>
        <p className="text-5xl font-bold text-[#F67E7D]">{me.status}</p>
        <StatusMap status={me.status} />
      </CardHeader>
      <CardContent className="space-y-10">
        <p className="text-lg text-[#02435F]">
          If you do not complete your application by{" "}
          <span className="font-semibold">January 31, 2025</span>, you will not
          be admitted!
        </p>
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          className="w-full bg-[#F67E7D] uppercase hover:bg-[#F67E7D]/90 text-lg py-6"
          asChild
        >
          <a href="/application">Complete your application!</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
