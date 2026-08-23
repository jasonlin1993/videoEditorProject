import Link from "next/link";
import Waveform from "./Waveform";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[80vh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Waveform />
        {/* 左側壓暗，讓標題壓在波形上仍讀得清楚 */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
      </div>

      <div className="px-6 pb-24 lg:px-13">
        <p className="text-xs tracking-[0.35em] text-muted">EDITOR · TAIPEI</p>

        <h1 className="mt-5 text-6xl font-semibold tracking-tight text-cream lg:text-7xl">
          陳某某
        </h1>

        <p className="mt-4 text-lg text-zinc-400">電影 · 廣告 · MV · 紀錄片</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="#works"
            className="bg-cream px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            看作品 ↓
          </Link>
          <Link
            href="/contact"
            className="border border-line px-8 py-4 text-sm font-medium text-cream transition-colors hover:border-cream/60 hover:bg-white/5"
          >
            聯絡我
          </Link>
        </div>
      </div>
    </section>
  );
}
