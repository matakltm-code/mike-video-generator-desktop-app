import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 1800; // 60s

export const yearInReviewTemplate: VideoTemplate = {
  id: "year-in-review",
  name: "Year in Review",
  description:
    "60-second annual highlights video with big milestones, growth stats, team achievements, and a forward-looking close — perfect for annual reports, investor updates, and company retrospectives.",
  duration: 60,
  category: "Branding",
  color: "#0f0f11",
  icon: "📊",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#0f0f11",
      scenes: [
        { from: 0, color: "#0f0f11" },
        { from: 240, color: "#1c1917" },
        { from: 540, color: "#0f0f11" },
        { from: 840, color: "#1c1917" },
        { from: 1140, color: "#0f0f11" },
        { from: 1440, color: "#1c1917" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Title
        txt("s1-badge", "● ANNUAL REVIEW", 15, 60, 540, 480, 16, "#a855f7", "center"),
        txt("s1-year", overrides.year ?? "2025", 30, 150, 540, 580, 88, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 800),
        txt("s1-subtitle", overrides.company ?? "[Company Name]", 90, 120, 540, 720, 34, "#d8b4fe", "center", { type: "slideUp", dur: 25 }),
        txt("s1-tagline", overrides.tagline ?? "A year of growth, impact, and innovation", 130, 80, 540, 800, 22, "#a1a1aa", "center", { type: "fadeIn", dur: 20 }),
        txt("s1-deco", "✦ ✦ ✦", 150, 60, 540, 880, 16, "#a855f7"),

        // Scene 2: Big Number
        txt("s2-label", "GROWTH AT A GLANCE", 250, 40, 540, 400, 16, "#a855f7", "center"),
        txt("s2-stat-main", overrides.stat1 ?? "250%", 280, 140, 540, 560, 96, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 800),
        txt("s2-stat-label", "Revenue growth year over year", 310, 80, 540, 700, 28, "#d8b4fe", "center", { type: "slideUp", dur: 20 }),
        txt("s2-stat-sub", "Exceeding our targets by 2.5×", 350, 80, 540, 780, 22, "#a1a1aa", "center", { type: "fadeIn", dur: 20 }),
        txt("s2-divider", "━ ━ ━ ━ ━", 380, 60, 540, 880, 14, "#3f3f46"),

        // Scene 3: Milestones
        txt("s3-label", "KEY MILESTONES", 550, 40, 540, 400, 16, "#a855f7", "center"),
        txt("s3-m1-icon", "✦", 590, 40, 200, 540, 18, "#a855f7"),
        txt("s3-m1", overrides.milestone1 ?? "Launched our flagship product v3.0", 590, 80, 240, 540, 30, "#fafafa", "left", { type: "slideUp", dur: 20 }),
        txt("s3-m1-date", overrides.m1date ?? "Q1 2025", 600, 60, 240, 590, 18, "#a1a1aa", "left"),
        txt("s3-m2-icon", "✦", 670, 40, 200, 680, 18, "#a855f7"),
        txt("s3-m2", overrides.milestone2 ?? "Expanded to 12 new markets globally", 670, 80, 240, 680, 30, "#fafafa", "left", { type: "slideUp", dur: 20 }),
        txt("s3-m2-date", overrides.m2date ?? "Q2 2025", 680, 60, 240, 730, 18, "#a1a1aa", "left"),
        txt("s3-m3-icon", "✦", 750, 40, 200, 820, 18, "#a855f7"),
        txt("s3-m3", overrides.milestone3 ?? "Surpassed 1 million active users", 750, 80, 240, 820, 30, "#fafafa", "left", { type: "slideUp", dur: 20 }),
        txt("s3-m3-date", overrides.m3date ?? "Q3 2025", 760, 60, 240, 870, 18, "#a1a1aa", "left"),
        txt("s3-m4-icon", "✦", 830, 40, 200, 960, 18, "#a855f7"),
        txt("s3-m4", overrides.milestone4 ?? "Named Best Place to Work 2025", 830, 80, 240, 960, 30, "#fafafa", "left", { type: "slideUp", dur: 20 }),
        txt("s3-m4-date", overrides.m4date ?? "Q4 2025", 840, 60, 240, 1010, 18, "#a1a1aa", "left"),

        // Scene 4: Impact Stats
        txt("s4-label", "BY THE NUMBERS", 850, 40, 540, 400, 16, "#a855f7", "center"),
        txt("s4-num1", overrides.num1 ?? "1M+", 880, 100, 160, 560, 72, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-num1-label", "Active Users", 890, 80, 160, 660, 24, "#d8b4fe", "left", { type: "slideUp", dur: 20 }),
        txt("s4-num2", overrides.num2 ?? "50+", 970, 100, 160, 800, 72, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-num2-label", "Countries Served", 980, 80, 160, 900, 24, "#d8b4fe", "left", { type: "slideUp", dur: 20 }),
        txt("s4-num3", overrides.num3 ?? "99.9%", 1060, 100, 160, 1040, 72, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-num3-label", "Uptime Guaranteed", 1070, 80, 160, 1140, 24, "#d8b4fe", "left", { type: "slideUp", dur: 20 }),

        // Scene 5: Team / People
        txt("s5-label", "OUR TEAM", 1150, 40, 540, 400, 16, "#a855f7", "center"),
        txt("s5-team-stat", overrides.teamStat ?? "200+", 1180, 100, 200, 540, 72, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s5-team-stat-label", "Team Members Worldwide", 1190, 80, 200, 640, 24, "#d8b4fe", "left", { type: "slideUp", dur: 20 }),
        txt("s5-perk1", "🌍  Remote-first since day one", 1230, 70, 200, 780, 28, "#e4e4e7", "left", { type: "slideUp", dur: 20 }),
        txt("s5-perk2", "📈  40% promoted from within", 1290, 70, 200, 870, 28, "#e4e4e7", "left", { type: "slideUp", dur: 20 }),
        txt("s5-perk3", "❤️  4.9 Glassdoor rating", 1350, 70, 200, 960, 28, "#e4e4e7", "left", { type: "slideUp", dur: 20 }),
        txt("s5-impact", "Together, we're building the future of [industry]", 1390, 100, 200, 1100, 22, "#a1a1aa", "left", { type: "fadeIn", dur: 20 }),

        // Scene 6: Looking Forward + CTA
        txt("s6-label", "LOOKING AHEAD", 1450, 40, 540, 420, 16, "#a855f7", "center"),
        txt("s6-headline", overrides.ahead ?? "An even bigger year ahead", 1470, 140, 540, 540, 56, "#ffffff", "center", { type: "slideUp", dur: 30 }, 700),
        txt("s6-preview1", "⚡  Next-gen platform launching Q1", 1510, 70, 200, 740, 28, "#d4d4d8", "left", { type: "fadeIn", dur: 20 }),
        txt("s6-preview2", "🌍  Expanding to 30 new markets", 1570, 70, 200, 830, 28, "#d4d4d8", "left", { type: "fadeIn", dur: 20 }),
        txt("s6-preview3", "🤝  Strategic partnerships incoming", 1630, 70, 200, 920, 28, "#d4d4d8", "left", { type: "fadeIn", dur: 20 }),
        txt("s6-cta", overrides.cta ?? "Here's to 2026", 1700, 100, 540, 1120, 48, "#d8b4fe", "center", { type: "fadeIn", dur: 25 }, 600),
        txt("s6-footer", `${overrides.company ?? "[Company]"} · ${overrides.year ?? "2025"} Annual Review`, 1720, 80, 540, 1600, 16, "#52525b", "center", { type: "fadeIn", dur: 15 }),
      ],
    },
  }),
};
