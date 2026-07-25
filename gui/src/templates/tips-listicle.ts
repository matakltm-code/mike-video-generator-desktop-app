import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";

const FPS = 30;
const DURATION = 1800; // 60 seconds

export const tipsListicleTemplate: VideoTemplate = {
  id: "tips-listicle",
  name: "Tips & Listicle",
  description:
    "60-second educational video with 3 numbered tips, clean slate palette, and smooth fade transitions — great for how-tos, thought leadership, and educational content.",
  duration: 60,
  category: "Educational",
  color: "#0f172a",
  icon: "📋",
  generate: (overrides = {}): VideoConfig => {
    const topic = overrides.topic ?? "3 Ways to Accelerate Growth";
    const tip1 = overrides.tip1 ?? "Focus on Your Core Audience";
    const tip1desc = overrides.tip1desc ?? "Identify the people who benefit most from what you offer and tailor every message to their needs. Depth beats breadth.";
    const tip2 = overrides.tip2 ?? "Leverage Data-Driven Decisions";
    const tip2desc = overrides.tip2desc ?? "Let analytics guide your strategy. Measure what matters, iterate quickly, and double down on what works.";
    const tip3 = overrides.tip3 ?? "Build Authentic Connections";
    const tip3desc = overrides.tip3desc ?? "Trust is the currency of modern business. Show up consistently, add value, and let your brand personality shine through.";
    const cta = overrides.cta ?? "Start Your Journey";

    const txt = (
      id: string,
      text: string,
      from: number,
      dur: number,
      x: number,
      y: number,
      fontSize: number,
      color: string,
      align: "left" | "center" | "right" = "center",
      anim?: { type: "fadeIn" | "slideUp" | "scaleIn"; dur: number },
      fontWeight = 400
    ) => ({
      id,
      type: "text" as const,
      text,
      from,
      durationInFrames: dur,
      position: { x, y },
      opacity: 1,
      style: {
        fontSize,
        color,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeight,
        textAlign: align,
      },
      animation: anim ? { type: anim.type, durationInFrames: anim.dur } : undefined,
    });

    return {
      version: "1.0",
      canvas: {
        width: 1080,
        height: 1920,
        fps: FPS,
        durationInFrames: DURATION,
        backgroundColor: "#0f172a",
        scenes: [
          { from: 0, color: "#0f172a" },       // slate
          { from: 240, color: "#1e293b" },      // lighter slate (8s)
          { from: 600, color: "#0f172a" },       // slate (20s)
          { from: 960, color: "#1e293b" },       // lighter slate (32s)
          { from: 1320, color: "#0f172a" },      // slate (44s)
        ],
      },
      tracks: {
        audio: [],
        elements: [
          // ── Scene 1: Intro (0s – 8s) ─────────────────────────────
          txt("s1-badge", "● TIPS & INSIGHTS", 15, 60, 540, 620, 16, "#60a5fa", "center"),
          txt("s1-topic", topic, 30, 150, 540, 740, 68, "#ffffff", "center", { type: "slideUp", dur: 35 }, 700),
          txt("s1-sub", "Actionable advice to level up your strategy", 90, 100, 540, 860, 26, "#94a3b8", "center", { type: "fadeIn", dur: 25 }),
          txt("s1-deco", "━ ━ ━", 110, 60, 540, 930, 14, "#60a5fa"),

          // ── Scene 2: Tip 1 (8s – 20s) ────────────────────────────
          txt("s2-num", "01", 250, 40, 160, 500, 36, "#60a5fa", "left", undefined, 700),
          txt("s2-title", tip1, 270, 160, 160, 590, 50, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
          txt("s2-quote", "\u201C", 300, 60, 160, 740, 48, "#3b82f6"),
          txt("s2-desc", tip1desc, 310, 180, 200, 810, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 30 }),
          txt("s2-tip-icon", "✦", 480, 60, 160, 1100, 18, "#60a5fa"),

          // ── Scene 3: Tip 2 (20s – 32s) ───────────────────────────
          txt("s3-num", "02", 610, 40, 160, 500, 36, "#60a5fa", "left", undefined, 700),
          txt("s3-title", tip2, 630, 160, 160, 590, 50, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
          txt("s3-quote", "\u201C", 660, 60, 160, 740, 48, "#3b82f6"),
          txt("s3-desc", tip2desc, 670, 180, 200, 810, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 30 }),
          txt("s3-tip-icon", "✦", 840, 60, 160, 1100, 18, "#60a5fa"),

          // ── Scene 4: Tip 3 (32s – 44s) ───────────────────────────
          txt("s4-num", "03", 970, 40, 160, 500, 36, "#60a5fa", "left", undefined, 700),
          txt("s4-title", tip3, 990, 160, 160, 590, 50, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
          txt("s4-quote", "\u201C", 1020, 60, 160, 740, 48, "#3b82f6"),
          txt("s4-desc", tip3desc, 1030, 180, 200, 810, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 30 }),
          txt("s4-tip-icon", "✦", 1200, 60, 160, 1100, 18, "#60a5fa"),

          // ── Scene 5: Summary & CTA (44s – 60s) ───────────────────
          txt("s5-label", "KEY TAKEAWAYS", 1330, 40, 540, 480, 18, "#60a5fa", "center"),
          txt("s5-recap-1", "01  Know your audience deeply", 1360, 80, 200, 620, 30, "#e2e8f0", "left", { type: "fadeIn", dur: 20 }),
          txt("s5-recap-2", "02  Let data guide your choices", 1430, 80, 200, 720, 30, "#e2e8f0", "left", { type: "fadeIn", dur: 20 }),
          txt("s5-recap-3", "03  Build trust through authenticity", 1500, 80, 200, 820, 30, "#e2e8f0", "left", { type: "fadeIn", dur: 20 }),
          txt("s5-cta", cta, 1580, 160, 540, 1080, 60, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
          txt("s5-footer", `${topic} · www.example.com`, 1650, 150, 540, 1600, 18, "#475569", "center", { type: "fadeIn", dur: 20 }),
        ],
      },
    };
  },
};
