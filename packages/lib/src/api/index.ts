import createClient, { Middleware } from "openapi-fetch";

import type { paths } from "./v1";
import { NextAuthResult } from "next-auth";

export const createFetchClient = (auth: NextAuthResult["auth"]) => {
  const fetchClient = createClient<paths>({
    baseUrl: "http://localhost:8080",
  });

  const middleware: Middleware = {
    async onRequest({ request, options }) {
      const session = await auth();
      if (session) {
        request.headers.set("Authorization", `Bearer ${session?.accessToken}`);
      }

      // logic here to refresh token if expired

      return request;
    },
  };

  fetchClient.use(middleware);

  return fetchClient;
};
