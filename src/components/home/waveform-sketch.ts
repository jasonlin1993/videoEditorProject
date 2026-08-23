import type p5 from "p5";

/**
 * Hero 背景的音訊波形：鏡像 bar + 金色 playhead + 選取區段。
 * 桌機移動滑鼠＝在波形上 scrub，觸控裝置則自動來回。
 */

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const BAR_STRIDE = BAR_WIDTH + BAR_GAP;

/** 波形中線位置，佔 hero 高度的比例 */
const CENTER_Y_RATIO = 0.6;
/** 最高的 bar 佔 hero 高度的比例（單邊） */
const MAX_BAR_RATIO = 0.2;

/** playhead 兩側選取區段的半寬 */
const REGION_HALF_WIDTH = 44;
/** playhead 附近多大範圍內的 bar 會被點亮 */
const GLOW_RADIUS = 170;
/** 觸控裝置自動來回一輪的秒數 */
const SWEEP_SECONDS = 16;
/** 滑鼠跟隨的緩動係數，越小越有拖曳感 */
const POINTER_EASING = 0.075;

const GOLD_RGB = "201, 169, 97";

const BAR_BASE: readonly [number, number, number] = [214, 208, 196];
const BAR_GOLD: readonly [number, number, number] = [201, 169, 97];

/**
 * 軟性上限：低於 knee 完全不動，超過才漸進收斂到 limit。
 * 用硬切（constrain）會讓 hover 放大的峰頂變成一塊平台，這裡改成保持圓弧。
 */
function softLimit(value: number, limit: number) {
  const knee = limit * 0.6;
  if (value <= knee) return value;
  const headroom = limit - knee;
  return knee + headroom * (1 - Math.exp(-(value - knee) / headroom));
}

export function createWaveformSketch(host: HTMLElement) {
  const cleanups: Array<() => void> = [];

  const sketch = (p: p5) => {
    let envelope: number[] = [];
    let playheadX = 0;
    let previousPlayheadX = 0;
    /** scrub 速度（0～1），平滑過的，用來決定波形被攪動的強度 */
    let scrubEnergy = 0;
    /** 滑鼠在視窗內的 X，尚未移動過為 null */
    let pointerClientX: number | null = null;
    let hostLeft = 0;
    let followPointer = false;
    let reduceMotion = false;
    let isVisible = true;

    /** 多層 noise 疊出像真實音檔的音量包絡，以 x 座標取樣讓形狀在改變視窗大小時保持不變 */
    const buildEnvelope = () => {
      const count = Math.ceil(p.width / BAR_STRIDE) + 1;
      const next: number[] = new Array(count);

      for (let i = 0; i < count; i++) {
        const x = i * BAR_STRIDE;
        const section = p.noise(x * 0.0026);
        const phrase = p.noise(x * 0.009 + 120);
        const grain = p.noise(x * 0.06 + 640);

        // 指數曲線拉開安靜段落與大聲段落的落差；grain 只做小幅逐根抖動，
        // 太強會變成尖刺，設計稿是連綿的丘陵
        const shaped = Math.pow(section * 0.6 + phrase * 0.4, 2.7) * 2.7;
        next[i] = Math.min(1, Math.max(0.05, shaped * (0.75 + grain * 0.45)));
      }

      envelope = next;
    };

    const updateLoopState = () => {
      if (isVisible && !reduceMotion) {
        p.loop();
      } else {
        p.noLoop();
        if (isVisible) p.redraw();
      }
    };

    p.setup = () => {
      const rect = host.getBoundingClientRect();
      hostLeft = rect.left;

      const canvas = p.createCanvas(rect.width, rect.height);
      canvas.elt.style.display = "block";
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      p.noiseSeed(7);
      p.noStroke();
      buildEnvelope();
      playheadX = rect.width * 0.38;

      const finePointer = window.matchMedia("(pointer: fine)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const syncMode = () => {
        followPointer = finePointer.matches;
        reduceMotion = reducedMotion.matches;
        updateLoopState();
      };

      syncMode();
      finePointer.addEventListener("change", syncMode);
      reducedMotion.addEventListener("change", syncMode);
      cleanups.push(() => {
        finePointer.removeEventListener("change", syncMode);
        reducedMotion.removeEventListener("change", syncMode);
      });

      // 只存原始 clientX，換算留到 draw，避免每次滑鼠移動都讀 layout
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pointerClientX = event.clientX;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      cleanups.push(() =>
        window.removeEventListener("pointermove", onPointerMove),
      );

      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        p.resizeCanvas(entry.contentRect.width, entry.contentRect.height);
        hostLeft = host.getBoundingClientRect().left;
        buildEnvelope();
        if (!isVisible || reduceMotion) p.redraw();
      });
      resizeObserver.observe(host);
      cleanups.push(() => resizeObserver.disconnect());

      // 捲出畫面就停止繪製，省電池
      const visibilityObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisible = entry.isIntersecting;
        updateLoopState();
      });
      visibilityObserver.observe(host);
      cleanups.push(() => visibilityObserver.disconnect());
    };

    p.draw = () => {
      const width = p.width;
      const height = p.height;
      const centerY = height * CENTER_Y_RATIO;
      const maxBar = height * MAX_BAR_RATIO;
      const seconds = p.millis() / 1000;

      p.clear();

      if (reduceMotion) {
        playheadX = width * 0.38;
      } else if (followPointer && pointerClientX !== null) {
        const target = p.constrain(pointerClientX - hostLeft, 0, width);
        playheadX += (target - playheadX) * POINTER_EASING;
      } else {
        // 觸控裝置（以及桌機滑鼠尚未移動前）：自動左右來回
        playheadX =
          width * (0.5 + 0.42 * Math.sin((p.TWO_PI * seconds) / SWEEP_SECONDS));
      }

      // 這一幀 playhead 移動了多少 → 攪動強度，用 lerp 讓它停下來後慢慢平息
      const scrubDelta = Math.abs(playheadX - previousPlayheadX);
      previousPlayheadX = playheadX;
      scrubEnergy += (Math.min(1, scrubDelta / 12) - scrubEnergy) * 0.12;

      // ── 選取區段 ─────────────────────────────
      p.noStroke();
      p.fill(255, 251, 242, 8);
      p.rect(playheadX - REGION_HALF_WIDTH, 0, REGION_HALF_WIDTH * 2, height);
      p.fill(255, 251, 242, 18);
      p.rect(playheadX - REGION_HALF_WIDTH, 0, 1, height);
      p.rect(playheadX + REGION_HALF_WIDTH, 0, 1, height);

      // ── 波形 ─────────────────────────────────
      for (let i = 0; i < envelope.length; i++) {
        const x = i * BAR_STRIDE;
        const distance = Math.abs(x + BAR_WIDTH / 2 - playheadX);
        const glow = Math.max(0, 1 - distance / GLOW_RADIUS);
        // 高度用比較寬、比較平緩的曲線 → 游標處隆起成一座平滑山丘；
        // 顏色用比較集中的曲線 → 金色只集中在 playhead 附近
        const hill = Math.pow(glow, 1.5);
        const lit = Math.pow(glow, 2.2);

        const breathe = reduceMotion
          ? 1
          : 1 + 0.055 * Math.sin(seconds * 1.3 + i * 0.09);
        // 游標附近變長，滑得越快隆起越多
        const boost = 1 + hill * (1.1 + scrubEnergy * 0.6);
        // 軟性收斂而非硬切，峰頂才不會被削成平台
        const barHeight = Math.max(
          1,
          softLimit(envelope[i] * breathe * boost * maxBar, maxBar * 2),
        );

        const r = p.lerp(BAR_BASE[0], BAR_GOLD[0], lit);
        const g = p.lerp(BAR_BASE[1], BAR_GOLD[1], lit);
        const b = p.lerp(BAR_BASE[2], BAR_GOLD[2], lit);
        const alpha = p.lerp(55, 225, lit);

        p.fill(r, g, b, alpha);
        p.rect(x, centerY - barHeight, BAR_WIDTH, barHeight);
        // 下半是倒影，稍微暗一點
        p.fill(r, g, b, alpha * 0.62);
        p.rect(x, centerY + 1, BAR_WIDTH, barHeight * 0.95);
        // 中線：用 BAR_STRIDE 寬度把 bar 之間的縫也填滿
        p.fill(r, g, b, p.lerp(22, 140, lit));
        p.rect(x, centerY, BAR_STRIDE, 1);
      }

      // ── playhead ────────────────────────────
      const ctx = p.drawingContext as CanvasRenderingContext2D;

      const halo = ctx.createLinearGradient(playheadX - 70, 0, playheadX + 70, 0);
      halo.addColorStop(0, `rgba(${GOLD_RGB}, 0)`);
      halo.addColorStop(0.5, `rgba(${GOLD_RGB}, 0.08)`);
      halo.addColorStop(1, `rgba(${GOLD_RGB}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(playheadX - 70, 0, 140, height);

      const line = ctx.createLinearGradient(0, 0, 0, height);
      line.addColorStop(0, `rgba(${GOLD_RGB}, 0.2)`);
      line.addColorStop(0.5, `rgba(${GOLD_RGB}, 0.95)`);
      line.addColorStop(1, `rgba(${GOLD_RGB}, 0.2)`);
      ctx.fillStyle = line;
      ctx.fillRect(playheadX, 0, 1, height);
    };
  };

  return {
    sketch,
    dispose: () => {
      cleanups.forEach((cleanup) => cleanup());
      cleanups.length = 0;
    },
  };
}
