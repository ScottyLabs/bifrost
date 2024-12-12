import { createCookieSessionStorage } from "@remix-run/node";

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
