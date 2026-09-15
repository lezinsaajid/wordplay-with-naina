import type VapiClient from "@vapi-ai/web";

/**
 * Vapi client for Naina. The public key and assistant id are browser-safe,
 * publishable values (like a Stripe publishable key) — they are embedded in
 * the client bundle by design, so they live in source rather than in a
 * committed .env file or server-side secrets.
 */
export const vapiPublicKey: string = "b44e0f30-45eb-439c-860c-cde970c8234a";
export const vapiAssistantId: string = "bc4a3a6a-62f9-46d3-83dd-4e09245e0ae2";

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
    console.error("[vapi] missing config", {
      publicKey: Boolean(vapiPublicKey),
      assistantId: Boolean(vapiAssistantId),
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
