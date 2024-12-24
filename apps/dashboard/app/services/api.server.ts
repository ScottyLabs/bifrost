import { paths } from "@bifrost/lib/api";
import createClient, { Middleware } from "openapi-fetch";
import { commitSession, destroySession, getSession } from "./session.server";
import { env } from "./env.server";
import { strategy } from "./auth.server";

import { jwtDecode } from "jwt-decode";
import { redirect } from "@remix-run/node";

function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const expirationTime = decoded.exp * 1000;
    return Date.now() > expirationTime - 5 * 60 * 1000;
  } catch {
    return true;
  }
}

export async function getClient(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  const info = session.get("info");
  const headers = new Headers();
  const accessToken = info?.accessToken;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const client = createClient<paths>({
    baseUrl: env.API_URL,
    headers,
  });

  const middleware: Middleware = {
    async onRequest(options) {
      if (info?.refreshToken && isTokenExpired(info.accessToken)) {
        try {
          const tokens = await strategy.refreshToken(info.refreshToken);
          session.set("info", {
            ...info,
            accessToken: tokens.accessToken(),
            refreshToken: tokens.refreshToken(),
          });

          await commitSession(session);
          options.request.headers.set(
            "Authorization",
            `Bearer ${tokens.accessToken()}`,
          );
          console.info("Token refreshed");
        } catch (e) {
          console.error("Token refresh failed", e);
          throw redirect("/auth/login", {
            headers: {
              "Set-Cookie": await destroySession(session),
            },
          });
        }
      }
    },
  };

  client.use(middleware);

  return client;
}
