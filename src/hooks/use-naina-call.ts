import { useCallback, useEffect, useRef, useState } from "react";
import {
  getVapiClient,
  isVapiConfigured,
  peekVapiClient,
  vapiAssistantId,
  vapiPublicKey,
} from "@/lib/vapi";

export type CallStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "ended"
  | "error";

type Options = {
  /** Extra context handed to Naina at call start (e.g. the chosen moment). */
  context?: Record<string, string>;
  /** Naina's opening line for this call, replacing her default first message. */
  firstMessage?: string;
  onEnded?: () => void;
};

function logVapi(label: string, e: unknown) {
  try {
    const anyE = e as Record<string, unknown> | null;
    console.error(`[vapi] ${label}`, e, anyE ? JSON.stringify(anyE, Object.getOwnPropertyNames(anyE ?? {})) : "");
  } catch {
    console.error(`[vapi] ${label}`, e);
  }
}

/** Pull whatever human-readable reason Vapi/Daily attached to the failure. */
function errorReason(e: unknown): string {
  if (!e) return "";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  const o = e as Record<string, unknown>;
  const nested = o["error"] as Record<string, unknown> | string | undefined;
  const parts = [
    o["message"],
    o["errorMsg"],
    o["msg"],
    o["type"],
    o["action"],
    typeof nested === "string" ? nested : nested?.["message"] ?? nested?.["msg"],
  ]
    .filter((v) => typeof v === "string" && v)
    .map(String);
  if (parts.length) return [...new Set(parts)].join(" · ");
  try {
    return JSON.stringify(o);
  } catch {
    return String(o);
  }
}

function friendlyError(e: unknown): string {
  const raw = errorReason(e);
  if (/permission|denied|notallowed|microphone|audio/i.test(raw)) {
    return "I can't hear you — your browser blocked the microphone. Allow mic access and try again.";
  }
  return raw
    ? `Something dropped on my end. (${raw.slice(0, 160)}) Try tapping again.`
    : "Something dropped on my end. Try tapping again.";
}

export function useNainaCall({ context, firstMessage, onEnded }: Options = {}) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;
  const contextRef = useRef(context);
  contextRef.current = context;

  // True only between an accepted start() and the call ending, so React cleanup
  // never stops a call that was never running.
  const activeRef = useRef(false);

  useEffect(() => {
    let disposed = false;
    let detach: (() => void) | undefined;


    const onCallStart = () => {
      console.info("[vapi] call-start");
      activeRef.current = true;
      setError(null);
      setStatus("listening");
    };
    const onCallEnd = () => {
      console.info("[vapi] call-end");
      activeRef.current = false;
      setStatus("ended");
      endedRef.current?.();
    };
    const onSpeechStart = () => setStatus((s) => (s === "ended" ? s : "speaking"));
    const onSpeechEnd = () => setStatus((s) => (s === "ended" ? s : "listening"));
    const onError = (e: unknown) => {
      logVapi("error event", e);
      activeRef.current = false;
      setError(friendlyError(e));
      setStatus("error");
    };
    const onMessage = (m: unknown) => {
      const type = (m as { type?: string })?.type;
      if (type === "status-update" || type === "end-of-call-report") {
        console.info("[vapi] message", m);
      }
    };

    void getVapiClient().then((vapi) => {
      if (!vapi || disposed) return;
      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("speech-start", onSpeechStart);
      vapi.on("speech-end", onSpeechEnd);
      vapi.on("error", onError);
      vapi.on("message", onMessage);
      detach = () => {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
        vapi.off("error", onError);
        vapi.off("message", onMessage);
      };
    });

    return () => {
      disposed = true;
      detach?.();
      if (activeRef.current) {
        activeRef.current = false;
        peekVapiClient()?.stop();
      }
    };
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    if (!isVapiConfigured) {
      console.error("[vapi] missing config", {
        VITE_VAPI_PUBLIC_KEY: Boolean(vapiPublicKey),
        VITE_VAPI_ASSISTANT_ID: Boolean(vapiAssistantId),
      });
      setError("Naina isn't connected yet — the voice keys are missing in this build.");
      setStatus("error");
      return;
    }
    try {
      // Ask for the mic up front so a denial reads as a friendly line, not a crash.
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
      probe.getTracks().forEach((t) => t.stop());
    } catch (e) {
      logVapi("microphone blocked", e);
      const inFrame = typeof window !== "undefined" && window.self !== window.top;
      setError(
        inFrame
          ? "I can't hear you — the preview frame is blocking the microphone. Open the app in its own tab and allow mic access."
          : "I can't hear you — your browser blocked the microphone. Allow mic access and try again.",
      );
      setStatus("error");
      return;
    }
    try {
      const vapi = await getVapiClient();
      if (!vapi) {
        setError("Naina isn't connected yet.");
        setStatus("error");
        return;
      }
      const ctx = contextRef.current;
      let call: unknown;
      try {
        call =
          ctx && Object.keys(ctx).length
            ? await vapi.start(vapiAssistantId, { variableValues: ctx })
            : await vapi.start(vapiAssistantId);
      } catch (overrideErr) {
        // Assistant overrides can be rejected; retry with the bare assistant id.
        logVapi("start with overrides failed, retrying bare", overrideErr);
        call = await vapi.start(vapiAssistantId);
      }
      activeRef.current = true;
      console.info("[vapi] start() resolved", call);
    } catch (e) {
      logVapi("start failed", e);
      setError(friendlyError(e));
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    activeRef.current = false;
    peekVapiClient()?.stop();
  }, []);

  return { status, error, start, stop, available: isVapiConfigured };
}
