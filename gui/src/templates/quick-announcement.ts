import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";

const FPS = 30;
const DURATION = 900; // 30 seconds

export const quickAnnouncementTemplate: VideoTemplate = {
  id: "quick-announcement",
  name: "Quick Announcement",
  description:
    "30-second high-energy announcement with bold headlines, vibrant gradients, and punchy animations — perfect for product launches, updates, or events.",
  duration: 30,
  category: "Social",
  color: "#2e1065",
  icon: "⚡",
  generate: (overrides = {}): VideoConfig => {
    const headline = overrides.headline ?? "Big News";
    const subhead = overrides.subhead ?? "Something amazing is here";
    const detail1 = overrides.detail1 ?? "Launching June 2025";
    const detail2 = overrides.detail2 ?? "Early access available";
    const cta = overrides.cta ?? "Join the Waitlist";

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
        backgroundColor: "#2e1065",
        scenes: [
          { from: 0, color: "#2e1065" },       // deep purple
          { from: 240, color: "#1e1b4b" },      // indigo (8s)
          { from: 480, color: "#2e1065" },       // purple (16s)
          { from: 720, color: "#1e1b4b" },       // indigo (24s)
        ],
      },
      tracks: {
        audio: [],
        elements: [
          // ── Scene 1: Bold Headline (0s – 8s) ─────────────────────
          txt("s1-badge", "● ANNOUNCEMENT", 15, 60, 540, 560, 16, "#a78bfa", "center"),
          txt("s1-headline", headline, 30, 150, 540, 680, 88, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 800),
          txt("s1-subhead", subhead, 80, 120, 540, 820, 34, "#c4b5fd", "center", { type: "slideUp", dur: 25 }),
          txt("s1-deco", "✦ ✦ ✦", 100, 60, 540, 920, 18, "#8b5cf6"),

          // ── Scene 2: Details (8s – 16s) ──────────────────────────
          txt("s2-label", "WHAT YOU NEED TO KNOW", 250, 40, 200, 540, 18, "#a78bfa", "left"),
          txt("s2-detail1", detail1, 280, 100, 200, 660, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
          txt("s2-detail1-deco", "→", 280, 30, 140, 670, 32, "#8b5cf6"),
          txt("s2-detail2", detail2, 360, 100, 200, 820, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
          txt("s2-detail2-deco", "→", 360, 30, 140, 830, 32, "#8b5cf6"),
          txt("s2-note", "Spaces are limited — reserve your spot today", 420, 60, 200, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),

          // ── Scene 3: Visual Impact (16s – 24s) ───────────────────
          txt("s3-icon", "⬡", 490, 30, 540, 540, 48, "#a78bfa"),
          txt("s3-impact", "This is just the beginning", 510, 120, 540, 680, 56, "#ffffff", "center", { type: "slideUp", dur: 30 }, 600),
          txt("s3-stats", "1,000+", 560, 80, 200, 880, 72, "#c4b5fd", "left", { type: "scaleIn", dur: 30 }, 800),
          txt("s3-stats-label", "early sign-ups already", 570, 80, 200, 980, 26, "#a78bfa", "left", { type: "slideUp", dur: 20 }),
          txt("s3-caption", "Join a growing community of innovators", 620, 80, 200, 1120, 22, "#64748b", "left", { type: "fadeIn", dur: 20 }),

          // ── Scene 4: CTA (24s – 30s) ─────────────────────────────
          txt("s4-cta", cta, 730, 140, 540, 740, 64, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
          txt("s4-cta-sub", "Be among the first to experience the future", 780, 100, 540, 860, 26, "#c4b5fd", "center", { type: "fadeIn", dur: 20 }),
          txt("s4-divider", "━ ━ ━", 800, 50, 540, 960, 14, "#8b5cf6"),
          txt("s4-footer", `${detail1} · ${detail2}`, 830, 70, 540, 1600, 18, "#64748b", "center", { type: "fadeIn", dur: 15 }),
        ],
      },
    };
  },
};
