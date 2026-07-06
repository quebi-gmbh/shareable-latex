import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import "../src/tailwind.css";

/**
 * Document shell. React Router injects per-route <title>/meta via <Meta /> and
 * the bundled CSS/JS via <Links />/<Scripts />. The static head bits that used
 * to live in index.html (favicon, theme-color, MathJax CDN preconnect) live
 * here now.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#030712" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
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

export function ErrorBoundary() {
  const error = useRouteError();

  // Chunk-load failures after a redeploy: offer a friendly refresh instead of
  // the raw developer error screen.
  const isChunkError =
    error instanceof TypeError &&
    error.message
      .toLowerCase()
      .includes("failed to fetch dynamically imported module");

  if (isChunkError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#030712] p-8 text-center text-[#f9fafb]">
        <p className="text-lg font-medium">Page couldn't load</p>
        <p className="max-w-sm text-[#9ca3af]">
          A newer version of the app was deployed. Refresh the page to continue.
        </p>
        <button
          className="rounded-md border border-[rgba(45,212,168,0.3)] bg-[#0b1120] px-4 py-2 text-sm hover:border-[#2dd4a8]"
          onClick={() => window.location.reload()}
        >
          Refresh now
        </button>
      </div>
    );
  }

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Unknown error";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-[#030712] p-8 text-center text-[#f9fafb]">
      <p className="text-lg font-medium">Something went wrong</p>
      <p className="font-mono text-sm text-[#9ca3af]">{message}</p>
    </div>
  );
}

export default function App() {
  return <Outlet />;
}
