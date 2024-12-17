import "~/styles/index.css";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
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
