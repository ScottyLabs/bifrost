import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getClient } from "~/services/client.server";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const info = session.get("info");

  if (!info) {
    throw redirect("/auth/login");
  }

  const client = await getClient(request);

  const status = await client.GET("/api/applications");

  return data({ info, status });
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return JSON.stringify(data);

  // return <StatusCard />;
}
