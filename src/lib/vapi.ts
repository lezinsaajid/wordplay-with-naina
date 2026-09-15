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
 * The SDK is browser-only, so it's imported dynamically after hydration;
 * the import itself is the documented default import.
 */
export async function getVapiClient(): Promise<VapiClient | null> {
  if (typeof window === "undefined") return null;
  if (!isVapiConfigured) {
    console.error("[vapi] missing env vars", {
      VITE_VAPI_PUBLIC_KEY: Boolean(vapiPublicKey),
      VITE_VAPI_ASSISTANT_ID: Boolean(vapiAssistantId),
    });
    return null;
  }
  if (client) return client;
  if (!loading) {
    loading = import("@vapi-ai/web")
      .then((mod) => {
        // The SDK is published as CommonJS: depending on how the bundler wraps it,
        // the constructor lands on `default`, `default.default`, or `Vapi`.
        const ns = mod as unknown as Record<string, unknown>;
        const nested = (ns["default"] as Record<string, unknown> | undefined)?.["default"];
        const Ctor = [ns["default"], nested, ns["Vapi"]].find(
          (v) => typeof v === "function",
        ) as (new (key: string) => VapiClient) | undefined;
        if (!Ctor) {
          throw new TypeError(
            `Vapi SDK export is not a constructor (keys: ${Object.keys(ns).join(",")})`,
          );
        }
        client = new Ctor(vapiPublicKey);
        return client;
      })
      .catch((e: unknown) => {
        console.error("[vapi] client init failed", e);
        loading = null;
        throw e;
      });
  }
  return loading;
}

/** Already-created instance, if any (safe for cleanup paths). */
export function peekVapiClient(): VapiClient | null {
  return client;
}
