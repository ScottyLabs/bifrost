import "~/styles/index.css";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { getSession } from "./services/session.server";
import { Header } from "./components/header";
import { Toaster } from "@bifrost/ui/ui/sonner";
import { User } from "./services/auth.server";

export const meta: MetaFunction = () => [{ title: "Tartanhacks Dashboard" }];

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  return (
    <div>
      <Toaster />
      <Header user={user} />
      <main className="w-full">{children}</main>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));
  const info = session.get("info");
  return { info };
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <Document>
      <Layout user={data.info}>
        <Outlet />
      </Layout>
    </Document>
  );
}

import React from "react";
import type { ErrorResponse } from "@remix-run/node";
import { Link } from "@remix-run/react";

interface GlobalNotFoundProps {
  error: ErrorResponse;
}

export const GlobalNotFound: React.FC<GlobalNotFoundProps> = ({ error }) => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center flex-col">
      <h2 className="text-6xl font-bold">{error.status}</h2>
      <p className="font-medium text-xl">Whoops...</p>
      <h1 className="font-medium text-xl">Page Not Found</h1>
      <Link to="/" className="mt-1 text-foreground font-bold">
        Back to homepage
      </Link>
    </section>
  );
};

interface GlobalRuntimeProps {
  error: unknown;
}

export const GlobalRuntime: React.FC<GlobalRuntimeProps> = ({ error }) => {
  const status = isRouteErrorResponse(error) ? error.status : 500;

  return (
    <section className="w-full min-h-screen flex items-center justify-center flex-col">
      <h2 className="text-6xl font-bold">{status}</h2>
      <p className="font-medium text-xl">Whoops...</p>
      <h1 className="font-medium text-xl">Internal server error</h1>
      <p className="text-sm">
        Please try again later or feel free to contact us if the problem
        persists
      </p>
    </section>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404)
      return (
        <Document>
          <GlobalNotFound error={error} />
        </Document>
      );
  }

  return (
    <Document>
      <GlobalRuntime error={error} />
    </Document>
  );
}
