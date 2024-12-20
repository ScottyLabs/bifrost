import { createCookieSessionStorage, redirect } from "@remix-run/node";

import type { TokenInfo, UserInfo } from "./auth.server";
import { env } from "./env.server";

type SessionData = {
  info: UserInfo & TokenInfo;
};

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function requireSession(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.has("info")) {
    throw redirect("/auth/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
