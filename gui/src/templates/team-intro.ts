import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 1350; // 45s

export const teamIntroTemplate: VideoTemplate = {
  id: "team-intro",
  name: "Team Introduction",
  description:
    "45-second culture-focused video introducing your team with a mission statement, core values, team highlights, and a careers CTA — great for company culture pages and recruiting.",
  duration: 45,
  category: "Branding",
  color: "#0f172a",
  icon: "👥",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#0f172a",
      scenes: [
        { from: 0, color: "#0f172a" },
        { from: 240, color: "#1e1b4b" },
        { from: 540, color: "#0f172a" },
        { from: 840, color: "#1e1b4b" },
        { from: 1080, color: "#0f172a" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Meet the Team
        txt("s1-badge", "● MEET THE TEAM", 15, 60, 540, 500, 16, "#818cf8", "center"),
        txt("s1-company", overrides.company ?? "[Company Name]", 30, 150, 540, 600, 64, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s1-tagline", overrides.tagline ?? "Built by people who care", 90, 100, 540, 720, 28, "#a5b4fc", "center", { type: "slideUp", dur: 25 }),
        txt("s1-mission-icon", "⬡", 120, 40, 540, 820, 24, "#6366f1"),
        txt("s1-mission", overrides.mission ?? "Our mission is simple: build tools that empower creators, entrepreneurs, and dreamers to bring their ideas to life.", 130, 120, 160, 890, 24, "#cbd5e1", "left", { type: "fadeIn", dur: 30 }),
        txt("s1-team-size", "🎯 50+ team members worldwide", 200, 60, 200, 1120, 20, "#818cf8", "left", { type: "fadeIn", dur: 20 }),

        // Scene 2: Core Values
        txt("s2-label", "OUR VALUES", 250, 40, 540, 420, 16, "#818cf8", "center"),
        txt("s2-val1-icon", "✦", 280, 40, 200, 540, 20, "#6366f1"),
        txt("s2-val1", overrides.value1 ?? "Innovation First", 280, 100, 240, 540, 36, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s2-val1-desc", "We challenge conventions and embrace bold ideas", 290, 80, 240, 600, 20, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s2-val2-icon", "✦", 360, 40, 200, 720, 20, "#6366f1"),
        txt("s2-val2", overrides.value2 ?? "People First", 360, 100, 240, 720, 36, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s2-val2-desc", "Our team and community drive everything we do", 370, 80, 240, 780, 20, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s2-val3-icon", "✦", 440, 40, 200, 900, 20, "#6366f1"),
        txt("s2-val3", overrides.value3 ?? "Sustainable Growth", 440, 100, 240, 900, 36, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s2-val3-desc", "Building for the long term, not the quick win", 450, 80, 240, 960, 20, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),

        // Scene 3: Team Members
        txt("s3-label", "TEAM SPOTLIGHT", 550, 40, 540, 400, 16, "#818cf8", "center"),
        txt("s3-member1-name", overrides.member1 ?? "[Name], [Role]", 580, 80, 200, 540, 34, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s3-member1-bio", overrides.bio1 ?? "\"I joined because I wanted to build something that matters. Three years later, I'm still amazed by what we create.\"", 590, 100, 200, 610, 22, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s3-member1-icon", "✦", 600, 30, 160, 580, 14, "#6366f1"),
        txt("s3-member2-name", overrides.member2 ?? "[Name], [Role]", 680, 80, 200, 820, 34, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s3-member2-bio", overrides.bio2 ?? "\"The collaborative culture here is unlike anything I've experienced. Everyone genuinely wants you to succeed.\"", 690, 100, 200, 890, 22, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s3-member2-icon", "✦", 700, 30, 160, 860, 14, "#6366f1"),
        txt("s3-member3-name", overrides.member3 ?? "[Name], [Role]", 780, 80, 200, 1100, 34, "#ffffff", "left", { type: "slideUp", dur: 25 }, 600),
        txt("s3-member3-bio", overrides.bio3 ?? "\"Every day brings a new challenge and a new opportunity to grow. That's why I love working here.\"", 790, 100, 200, 1170, 22, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),

        // Scene 4: Culture / Perks
        txt("s4-label", "LIFE AT THE COMPANY", 850, 40, 540, 400, 16, "#818cf8", "center"),
        txt("s4-perk1", "🌍  Remote-first culture", 880, 70, 200, 540, 30, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-perk2", "📈  Growth & learning budget", 940, 70, 200, 640, 30, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-perk3", "❤️  Comprehensive health & wellness", 1000, 70, 200, 740, 30, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-perk4", "🎉  Regular team events & retreats", 1060, 70, 200, 840, 30, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-perk5", "🏆  Equity for all full-time team members", 1120, 70, 200, 940, 30, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-stat", "92% employee satisfaction", 1160, 80, 200, 1100, 24, "#818cf8", "left", { type: "fadeIn", dur: 20 }),

        // Scene 5: CTA
        txt("s5-cta", overrides.cta ?? "Join Our Team", 1100, 200, 540, 600, 64, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s5-sub", overrides.recruiting ?? "We're hiring across engineering, design, and product", 1150, 160, 540, 720, 26, "#a5b4fc", "center", { type: "slideUp", dur: 20 }),
        txt("s5-divider", "━ ━ ━ ━ ━", 1180, 60, 540, 840, 14, "#6366f1"),
        txt("s5-link", `${overrides.company ?? "[Company]"}.com/careers`, 1220, 100, 540, 940, 24, "#c7d2fe", "center", { type: "fadeIn", dur: 20 }),
        txt("s5-diversity", "Equal opportunity employer · All backgrounds welcome", 1260, 90, 540, 1600, 16, "#475569", "center", { type: "fadeIn", dur: 20 }),
      ],
    },
  }),
};
