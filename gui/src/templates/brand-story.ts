import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";

const FPS = 30;
const DURATION = 1800; // 60 seconds

/**
 * Brand Story — 60-second professional brand awareness video.
 *
 * Scenes:
 *   0. 0:00 – Intro / Logo reveal
 *   1. 0:08 – The Challenge
 *   2. 0:18 – Our Solution
 *   3. 0:33 – Results & Impact
 *   4. 0:48 – Call to Action
 */
export const brandStoryTemplate: VideoTemplate = {
  id: "brand-story",
  name: "Brand Story",
  description:
    "Professional 5-scene brand awareness video with animated headlines, value props, and a strong call to action — perfect for company introductions.",
  duration: 60,
  category: "Branding",
  color: "#0f172a",
  icon: "🏢",
  generate: (overrides = {}): VideoConfig => {
    const brand = overrides.brand ?? "[Your Company]";
    const tagline = overrides.tagline ?? "Innovating Tomorrow, Today";
    const challenge = overrides.challenge ?? "The modern landscape moves faster than ever.";
    const solution = overrides.solution ?? "We help businesses scale with intelligent automation.";
    const result1 = overrides.result1 ?? "10× faster delivery";
    const result2 = overrides.result2 ?? "60% cost reduction";
    const cta = overrides.cta ?? "Get Started Today";

    // Helper: create a text element
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
      animation?: { type: "fadeIn" | "slideUp" | "scaleIn"; dur: number },
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
      animation: animation ? { type: animation.type, durationInFrames: animation.dur } : undefined,
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
          { from: 0, color: "#0f172a" },       // deep navy
          { from: 240, color: "#1e1b4b" },      // deep indigo (8s)
          { from: 540, color: "#0f172a" },       // back to navy (18s)
          { from: 990, color: "#0c0a2d" },       // dark violet (33s)
          { from: 1440, color: "#0f172a" },      // navy outro (48s)
        ],
      },
      tracks: {
        audio: [],
        elements: [
          // ── Scene 1: Intro (0s – 8s) ─────────────────────────────
          txt("s1-deco-1", "✦", 10, 90, 540, 640, 48, "#6366f1"),
          txt("s1-brand", brand, 10, 140, 540, 780, 80, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 700),
          txt("s1-tagline", tagline, 70, 140, 540, 900, 32, "#94a3b8", "center", { type: "fadeIn", dur: 30 }),
          txt("s1-deco-2", "━━━", 70, 80, 540, 860, 16, "#6366f1"),
          txt("s1-sublabel", "Proudly crafted with purpose", 160, 80, 540, 1000, 20, "#64748b", "center", { type: "fadeIn", dur: 25 }),

          // ── Scene 2: Challenge (8s – 18s) ─────────────────────────
          txt("s2-label", "THE CHALLENGE", 250, 40, 540, 600, 18, "#818cf8", "center"),
          txt("s2-deco", "◆", 260, 40, 540, 650, 14, "#6366f1"),
          txt("s2-headline", "Change is accelerating", 280, 120, 540, 760, 64, "#ffffff", "center", { type: "slideUp", dur: 35 }, 700),
          txt("s2-body", challenge, 320, 140, 200, 940, 30, "#cbd5e1", "left", { type: "fadeIn", dur: 30 }),
          txt("s2-stat-1", "78%", 360, 80, 200, 1080, 56, "#818cf8", "left", { type: "slideUp", dur: 25 }, 700),
          txt("s2-stat-1-label", "of companies face disruption", 370, 80, 320, 1110, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),

          // ── Scene 3: Solution (18s – 33s) ─────────────────────────
          txt("s3-label", "OUR SOLUTION", 550, 40, 540, 400, 18, "#6366f1", "center"),
          txt("s3-deco", "━━━", 560, 40, 540, 440, 14, "#6366f1"),
          txt("s3-headline", "Intelligent Automation", 570, 100, 540, 540, 64, "#ffffff", "center", { type: "slideUp", dur: 35 }, 700),
          txt("s3-pt1", "→  Seamless integration with your workflow", 610, 80, 200, 740, 28, "#e2e8f0", "left", { type: "slideUp", dur: 25 }),
          txt("s3-pt2", "→  AI-powered insights in real time", 690, 80, 200, 840, 28, "#e2e8f0", "left", { type: "slideUp", dur: 25 }),
          txt("s3-pt3", "→  Enterprise-grade security & reliability", 770, 80, 200, 940, 28, "#e2e8f0", "left", { type: "slideUp", dur: 25 }),
          txt("s3-body", solution, 850, 140, 200, 1080, 26, "#94a3b8", "left", { type: "fadeIn", dur: 30 }),

          // ── Scene 4: Results (33s – 48s) ──────────────────────────
          txt("s4-label", "RESULTS THAT MATTER", 1000, 40, 540, 400, 18, "#818cf8", "center"),
          txt("s4-deco", "◆", 1010, 30, 540, 440, 14, "#6366f1"),
          txt("s4-result1-num", "10×", 1040, 100, 200, 620, 72, "#a5b4fc", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s4-result1-label", "Faster Delivery", 1050, 100, 200, 720, 28, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
          txt("s4-result2-num", "60%", 1130, 100, 200, 880, 72, "#a5b4fc", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s4-result2-label", "Cost Reduction", 1140, 100, 200, 980, 28, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
          txt("s4-result3-num", "99.9%", 1220, 100, 200, 1140, 72, "#a5b4fc", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s4-result3-label", "Uptime Guarantee", 1230, 100, 200, 1240, 28, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),

          // ── Scene 5: CTA (48s – 60s) ──────────────────────────────
          txt("s5-cta", cta, 1460, 200, 540, 780, 72, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 700),
          txt("s5-cta-sub", `${brand} — ${tagline}`, 1520, 180, 540, 900, 28, "#818cf8", "center", { type: "fadeIn", dur: 30 }),
          txt("s5-cta-btn", "[ Visit our website ]", 1580, 160, 540, 1020, 26, "#94a3b8", "center", { type: "fadeIn", dur: 25 }),
          txt("s5-brand-outro", `© ${brand}`, 1660, 140, 540, 1600, 18, "#475569", "center", { type: "fadeIn", dur: 20 }),
        ],
      },
    };
  },
};
