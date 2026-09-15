import Vapi from "@vapi-ai/web";

/**
 * Vapi client for Naina. Credentials come from environment variables
 * (VITE_VAPI_PUBLIC_KEY / VITE_VAPI_ASSISTANT_ID) — never from components.
 * The public key and assistant id are browser-safe, publishable values.
 */
export const vapiPublicKey: string = import.meta.env["VITE_VAPI_PUBLIC_KEY"] ?? "";
export const vapiAssistantId: string = import.meta.env["VITE_VAPI_ASSISTANT_ID"] ?? "";

export const isVapiConfigured = Boolean(vapiPublicKey && vapiAssistantId);

let client: Vapi | null = null;

/** Lazily create a single browser-side Vapi instance. Returns null on the server. */
export function getVapiClient(): Vapi | null {
  if (typeof window === "undefined" || !isVapiConfigured) return null;
  if (!client) client = new Vapi(vapiPublicKey);
  return client;
}
