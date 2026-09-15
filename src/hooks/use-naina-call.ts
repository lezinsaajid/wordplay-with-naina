import { useCallback, useEffect, useRef, useState } from "react";
import {
  getVapiClient,
  isVapiConfigured,
  peekVapiClient,
  vapiAssistantId,
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

function friendlyError(e: unknown): string {
  const raw =
    e instanceof Error
      ? e.message
      : typeof e === "object" && e && "message" in e
        ? String((e as { message: unknown }).message)
        : "";
  return /permission|denied|notallowed|microphone/i.test(raw)
    ? "I can't hear you — your browser blocked the microphone. Allow mic access and try again."
    : "Something dropped on my end. Try tapping again.";
}

export function useNainaCall({ context, onEnded }: Options = {}) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;
  const contextRef = useRef(context);
  contextRef.current = context;

  useEffect(() => {
    let disposed = false;
    let detach: (() => void) | undefined;

    const onCallStart = () => {
      setError(null);
      setStatus("listening");
    };
    const onCallEnd = () => {
      setStatus("ended");
      endedRef.current?.();
    };
    const onSpeechStart = () => setStatus((s) => (s === "ended" ? s : "speaking"));
    const onSpeechEnd = () => setStatus((s) => (s === "ended" ? s : "listening"));
    const onError = (e: unknown) => {
      setError(friendlyError(e));
      setStatus("error");
    };

    void getVapiClient().then((vapi) => {
      if (!vapi || disposed) return;
      vapi.on("call-start", onCallStart);
      vapi.on("call-end", onCallEnd);
      vapi.on("speech-start", onSpeechStart);
      vapi.on("speech-end", onSpeechEnd);
      vapi.on("error", onError);
      detach = () => {
        vapi.off("call-start", onCallStart);
        vapi.off("call-end", onCallEnd);
        vapi.off("speech-start", onSpeechStart);
        vapi.off("speech-end", onSpeechEnd);
        vapi.off("error", onError);
      };
    });

    return () => {
      disposed = true;
      detach?.();
      peekVapiClient()?.stop();
    };
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    try {
      // Ask for the mic up front so a denial reads as a friendly line, not a crash.
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "I can't hear you — your browser blocked the microphone. Allow mic access and try again.",
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
      await vapi.start(vapiAssistantId, {
        variableValues: contextRef.current ?? {},
      });
    } catch (e) {
      setError(friendlyError(e));
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    peekVapiClient()?.stop();
  }, []);

  return { status, error, start, stop, available: isVapiConfigured };
}
