import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.authenticate("oidc", request);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const info = session.get("info");
  if (info) throw redirect("/");
  await authenticator.authenticate("oidc", request);
}
