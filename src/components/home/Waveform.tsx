"use client";

import { useEffect, useRef } from "react";
import type p5 from "p5";
import { createWaveformSketch } from "./waveform-sketch";

export default function Waveform() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let instance: p5 | undefined;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    // p5 需要 window，且體積不小，動態載入切成獨立 chunk
    void import("p5").then(({ default: P5 }) => {
      if (cancelled) return;
      const created = createWaveformSketch(host);
      dispose = created.dispose;
      instance = new P5(created.sketch, host);
    });

    return () => {
      cancelled = true;
      dispose?.();
      instance?.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}
