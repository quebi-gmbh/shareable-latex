import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

const emptySubscribe = () => () => {};

/**
 * Renders `children()` only after hydration; before that (during the build-time
 * prerender and the very first client render) it renders `fallback`.
 *
 * The editor mounts browser-only machinery (MathLive custom elements, the
 * MathJax CDN script, a Three.js canvas, and code that reads
 * window.location at first render) that can't run in the non-DOM prerender
 * environment. Gating it here keeps the prerendered HTML to a lightweight,
 * crawlable intro while the real app loads on the client.
 *
 * `children` is a thunk so the app subtree isn't even constructed server-side.
 */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: () => ReactNode;
  fallback?: ReactNode;
}) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return <>{hydrated ? children() : fallback}</>;
}
