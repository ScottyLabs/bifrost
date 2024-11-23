import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "bifrost",
      name: "Bifrost",
      type: "oidc",
      issuer: "http://localhost:9000",
      clientId: "bifrost-registration",
      clientSecret: "registration-secret",
    },
  ],
});
