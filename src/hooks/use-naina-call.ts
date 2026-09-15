import { useCallback, useEffect, useRef, useState } from "react";
import { getVapiClient, isVapiConfigured, vapiAssistantId } from "@/lib/vapi";

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

export function useNainaCall({ context, onEnded }: Options = {}) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  const contextRef = useRef(context);
  contextRef.current = context;

  useEffect(() => {
    const vapi = getVapiClient();
    if (!vapi) return;

    const onCallStart = () => {
      setError(null);
      setStatus("listening");
    };
    const onCallEnd = () => {
      setStatus("ended");
      endedRef.current?.();
    };
    const onSpeechStart = () => setStatus("speaking");
    const onSpeechEnd = () => setStatus((s) => (s === "ended" ? s : "listening"));
    const onError = (e: unknown) => {
      const raw =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in e
            ? String((e as { message: unknown }).message)
            : "";
      setError(
        /permission|denied|notallowed/i.test(raw)
          ? "I can't hear you — your browser blocked the microphone. Allow mic access and try again."
          : "Something dropped on my end. Try tapping again.",
      );
      setStatus("error");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const start = useCallback(async () => {
    const vapi = getVapiClient();
    if (!vapi) {
      setError("Naina isn't connected yet.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("connecting");
    try {
      // Ask for the mic up front so denial reads as a friendly message, not a crash.
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "I can't hear you — your browser blocked the microphone. Allow mic access and try again.",
      );
      setStatus("error");
      return;
    }
    try {
      await vapi.start(vapiAssistantId, {
        variableValues: contextRef.current ?? {},
      });
    } catch {
      setError("Couldn't reach Naina just now. Try again in a moment.");
      setStatus("error");
    }
  }, []);

  const stop = useCallback(() => {
    getVapiClient()?.stop();
  }, []);

  useEffect(() => {
    return () => {
      getVapiClient()?.stop();
    };
  }, []);

  return { status, error, start, stop, available: isVapiConfigured };
}
