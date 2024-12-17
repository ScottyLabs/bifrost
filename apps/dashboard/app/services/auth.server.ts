import { Authenticator } from "remix-auth";
import { OAuth2Strategy } from "remix-auth-oauth2";

import { env } from "./env.server";

export type UserInfo = {
  amr: string[];
  aud: string[];
  auth_time: number;
  email: string;
  email_verified: boolean;
  iat: number;
  iss: string;
  rat: string;
  sub: string;
  updated_at: number;
};

export type TokenInfo = {
  accessToken: string;
  refreshToken: string;
};

export type User = UserInfo & TokenInfo;

export const authenticator = new Authenticator<User>();

export const strategy = new OAuth2Strategy<User>(
  {
    clientId: env.OIDC_CLIENT_ID,
    clientSecret: env.OIDC_CLIENT_SECRET,

    authorizationEndpoint: `${env.OIDC_ISSUER}/oauth2/auth`,
    tokenEndpoint: `${env.OIDC_ISSUER}/oauth2/token`,
    redirectURI: `${env.URL}/auth/callback`,

    scopes: ["openid", "email", "profile", "offline_access"],
  },
  async ({ tokens }) => {
    const response = await fetch(`${env.OIDC_ISSUER}/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();

    const tokenInfo: TokenInfo = {
      accessToken: tokens.accessToken(),
      refreshToken: tokens.refreshToken(),
    };

    return { ...userInfo, ...tokenInfo };
  },
);

authenticator.use(strategy, "oidc");
