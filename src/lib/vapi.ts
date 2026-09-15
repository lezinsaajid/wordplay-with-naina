import type VapiClient from "@vapi-ai/web";

/**
 * Vapi client for Naina. Credentials come from environment variables
 * (VITE_VAPI_PUBLIC_KEY / VITE_VAPI_ASSISTANT_ID) — never from components.
 * The public key and assistant id are browser-safe, publishable values.
 */
export const vapiPublicKey: string = import.meta.env["VITE_VAPI_PUBLIC_KEY"] ?? "";
export const vapiAssistantId: string = import.meta.env["VITE_VAPI_ASSISTANT_ID"] ?? "";

export const isVapiConfigured = Boolean(vapiPublicKey && vapiAssistantId);

let client: VapiClient | null = null;
let loading: Promise<VapiClient | null> | null = null;

/**
 * Lazily create a single browser-side Vapi instance.
 * The SDK is browser-only, so it's imported dynamically after hydration.
 */
export async function getVapiClient(): Promise<VapiClient | null> {
  if (typeof window === "undefined" || !isVapiConfigured) return null;
  if (client) return client;
  if (!loading) {
    loading = import("@vapi-ai/web").then((mod) => {
      // The SDK ships CJS/ESM interop variants; resolve whichever export is the class.
      const candidate = mod as unknown as {
        default?: unknown;
        Vapi?: unknown;
      };
      const nested = (candidate.default as { default?: unknown } | undefined)?.default;
      const Ctor = [nested, candidate.default, candidate.Vapi].find(
        (v) => typeof v === "function",
      ) as (new (key: string) => VapiClient) | undefined;
      if (!Ctor) throw new Error("Vapi SDK failed to load");
      client = new Ctor(vapiPublicKey);
      return client;
    });
  }
  return loading;
}

/** Already-created instance, if any (safe for cleanup paths). */
export function peekVapiClient(): VapiClient | null {
  return client;
}
