import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { StatusCard } from "~/components/status-card";
import { getClient } from "~/services/api.server";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const info = session.get("info");

  console.log(info);

  if (!info) {
    console.log("Redirecting to /auth/login");
    throw redirect("/auth/login");
  }

  const client = await getClient(request);

  const [application, me] = await Promise.all([
    client.GET("/api/applications"),
    client.GET("/api/users/me"),
  ]);

  return { info, application: application.data, me: me.data };
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="h-screen grid place-items-center">
      <StatusCard me={data.me} application={data.application} />
    </div>
  );
}
