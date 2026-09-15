// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { createRequire } from "node:module";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const require = createRequire(import.meta.url);
const eventsShim = require.resolve("events/events.js");

/**
 * The browser build otherwise stubs Node's `events` to an empty object, so
 * `@vapi-ai/web` (whose emitter class extends EventEmitter) dies at module
 * evaluation with "superclass is not a constructor". Point it at the real
 * browser-safe `events` package for the client bundle only.
 */
const eventsForBrowser = {
  name: "events-browser-shim",
  enforce: "pre" as const,
  resolveId(this: { environment?: { name?: string } }, id: string) {
    if ((id === "events" || id === "node:events") && this.environment?.name === "client") {
      return eventsShim;
    }
    return null;
  },
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [eventsForBrowser],
  },
});
