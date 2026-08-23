import Link from "next/link";
import type { Work } from "@/lib/mock-data";

export default function WorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/works/${work.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden border border-line transition-colors duration-300 group-hover:border-gold/70">
        {/* 縮圖佔位漸層，等真實縮圖進來後換成 next/image */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(140deg, ${work.thumbFrom}, ${work.thumbTo})`,
          }}
        />

        {/* 播放鍵：hover 播放預覽時淡出 */}
        <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/50">
            <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-cream/80" />
          </span>
        </span>

        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-gold">▶</span>
          預覽中
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-sm text-cream">{work.title}</span>
        <span className="text-xs text-muted">·</span>
        <span className="text-sm text-muted">{work.tag}</span>
      </div>
    </Link>
  );
}
