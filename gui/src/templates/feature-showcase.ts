import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";

const FPS = 30;
const DURATION = 1350; // 45 seconds

export const featureShowcaseTemplate: VideoTemplate = {
  id: "feature-showcase",
  name: "Feature Showcase",
  description:
    "45-second product demo highlighting three key features with bold stats, animated icons, and a closing CTA — ideal for product launches.",
  duration: 45,
  category: "Product",
  color: "#022c22",
  icon: "🚀",
  generate: (overrides = {}): VideoConfig => {
    const product = overrides.product ?? "[Product Name]";
    const feature1 = overrides.feature1 ?? "Lightning Fast Performance";
    const feature2 = overrides.feature2 ?? "Zero Configuration Setup";
    const feature3 = overrides.feature3 ?? "Enterprise Security First";
    const cta = overrides.cta ?? "Try It Free Today";

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
        backgroundColor: "#022c22",
        scenes: [
          { from: 0, color: "#022c22" },       // dark emerald
          { from: 180, color: "#0a0a1a" },      // dark (6s)
          { from: 480, color: "#022c22" },       // emerald (16s)
          { from: 780, color: "#0a0a1a" },       // dark (26s)
          { from: 1080, color: "#022c22" },      // emerald (36s)
        ],
      },
      tracks: {
        audio: [],
        elements: [
          // ── Scene 1: Intro (0s – 6s) ─────────────────────────────
          txt("s1-icon", "⬡", 15, 90, 540, 650, 64, "#34d399"),
          txt("s1-product", product, 30, 135, 540, 780, 76, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 700),
          txt("s1-sub", "Reimagined for the modern era", 90, 90, 540, 890, 28, "#6ee7b7", "center", { type: "fadeIn", dur: 25 }),
          txt("s1-deco", "━ ━ ━", 110, 60, 540, 960, 14, "#34d399"),

          // ── Scene 2: Feature 1 (6s – 16s) ─────────────────────────
          txt("s2-num", "01", 190, 30, 200, 520, 24, "#34d399", "left", undefined, 600),
          txt("s2-title", feature1, 210, 140, 200, 600, 56, "#ffffff", "left", { type: "slideUp", dur: 35 }, 700),
          txt("s2-stat", "240×", 260, 80, 200, 760, 80, "#34d399", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s2-stat-label", "faster than legacy systems", 270, 80, 200, 870, 26, "#a7f3d0", "left", { type: "slideUp", dur: 20 }),
          txt("s2-desc", "Built on a next-generation architecture that processes data at unprecedented speed — without compromising accuracy or reliability.", 300, 160, 200, 1020, 24, "#94a3b8", "left", { type: "fadeIn", dur: 25 }),

          // ── Scene 3: Feature 2 (16s – 26s) ────────────────────────
          txt("s3-num", "02", 490, 30, 200, 520, 24, "#34d399", "left", undefined, 600),
          txt("s3-title", feature2, 510, 140, 200, 600, 56, "#ffffff", "left", { type: "slideUp", dur: 35 }, 700),
          txt("s3-stat", "5 min", 560, 80, 200, 760, 80, "#34d399", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s3-stat-label", "average setup time", 570, 80, 200, 870, 26, "#a7f3d0", "left", { type: "slideUp", dur: 20 }),
          txt("s3-desc", "No complex configuration required. Our intelligent onboarding wizard gets you from sign-up to first success in under five minutes.", 600, 160, 200, 1020, 24, "#94a3b8", "left", { type: "fadeIn", dur: 25 }),

          // ── Scene 4: Feature 3 (26s – 36s) ────────────────────────
          txt("s4-num", "03", 790, 30, 200, 520, 24, "#34d399", "left", undefined, 600),
          txt("s4-title", feature3, 810, 140, 200, 600, 56, "#ffffff", "left", { type: "slideUp", dur: 35 }, 700),
          txt("s4-stat", "SOC 2", 860, 80, 200, 760, 80, "#34d399", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s4-stat-label", "certified & compliant", 870, 80, 200, 870, 26, "#a7f3d0", "left", { type: "slideUp", dur: 20 }),
          txt("s4-desc", "Your data is protected by enterprise-grade encryption, zero-trust architecture, and round-the-clock monitoring — because security is non-negotiable.", 900, 160, 200, 1020, 24, "#94a3b8", "left", { type: "fadeIn", dur: 25 }),

          // ── Scene 5: CTA (36s – 45s) ──────────────────────────────
          txt("s5-cta", cta, 1100, 200, 540, 720, 72, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 700),
          txt("s5-sub", `Start your journey with ${product}`, 1150, 160, 540, 840, 28, "#6ee7b7", "center", { type: "fadeIn", dur: 25 }),
          txt("s5-deco", "⬡", 1200, 100, 540, 960, 48, "#34d399"),
          txt("s5-footer", "No credit card required · Cancel anytime", 1230, 120, 540, 1600, 20, "#64748b", "center", { type: "fadeIn", dur: 20 }),
        ],
      },
    };
  },
};
