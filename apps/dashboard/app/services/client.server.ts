import { paths } from "@bifrost/lib/api/v1";
import createClient from "openapi-fetch";
import { getSession } from "./session.server";
import { env } from "./env.server";

export async function getClient(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const info = session.get("info");
  const accessToken = info?.accessToken;
  return createClient<paths>({
    baseUrl: env.API_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
