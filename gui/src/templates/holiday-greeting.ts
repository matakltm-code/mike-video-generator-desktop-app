import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 900; // 30s

export const holidayGreetingTemplate: VideoTemplate = {
  id: "holiday-greeting",
  name: "Holiday Greeting",
  description:
    "30-second warm seasonal greeting with festive visuals, a heartfelt message, and well-wishes — perfect for holiday cards, New Year greetings, and company celebrations.",
  duration: 30,
  category: "Social",
  color: "#1a0000",
  icon: "🎄",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#1a0000",
      scenes: [
        { from: 0, color: "#1a0000" },
        { from: 240, color: "#0a1628" },
        { from: 480, color: "#1a0000" },
        { from: 720, color: "#0a1628" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Warm Opening
        txt("s1-deco-top", "✦ ✦ ✦", 15, 60, 540, 520, 18, "#fbbf24"),
        txt("s1-greeting", overrides.greeting ?? "Happy Holidays", 30, 150, 540, 600, 72, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s1-from", `From all of us at ${overrides.company ?? "[Company Name]"}`, 80, 100, 540, 740, 28, "#fcd34d", "center", { type: "slideUp", dur: 25 }),
        txt("s1-deco-bottom", "✦ ✦ ✦", 100, 60, 540, 840, 18, "#fbbf24"),
        txt("s1-season", "Wishing you warmth and joy this season", 120, 80, 540, 940, 22, "#d4d4d8", "center", { type: "fadeIn", dur: 20 }),

        // Scene 2: Year in Reflection
        txt("s2-badge", "● THIS YEAR", 250, 40, 540, 480, 16, "#60a5fa", "center"),
        txt("s2-headline", overrides.reflection ?? "What a year it's been", 270, 120, 540, 580, 52, "#ffffff", "center", { type: "slideUp", dur: 30 }, 600),
        txt("s2-body", overrides.message ?? "Thank you for being part of our journey. Your trust and partnership inspire us every day to reach higher and dream bigger.", 310, 140, 160, 740, 26, "#bfdbfe", "left", { type: "fadeIn", dur: 30 }),
        txt("s2-deco", "◆", 380, 40, 540, 960, 16, "#60a5fa"),

        // Scene 3: Gratitude
        txt("s3-badge", "● WITH GRATITUDE", 490, 40, 540, 440, 16, "#fbbf24", "center"),
        txt("s3-headline", overrides.gratitude ?? "Thank You", 510, 120, 540, 560, 64, "#ffffff", "center", { type: "scaleIn", dur: 30 }, 700),
        txt("s3-body", overrides.thankyou ?? "None of this would be possible without you. Here's to celebrating our shared successes and looking forward to an even brighter future together.", 540, 150, 160, 700, 26, "#fef3c7", "left", { type: "fadeIn", dur: 30 }),
        txt("s3-deco", "━━━", 600, 40, 540, 940, 14, "#fbbf24"),

        // Scene 4: Closing Wishes
        txt("s4-headline", overrides.wish ?? "Wishing You &\nYour Loved Ones", 730, 140, 540, 500, 56, "#ffffff", "center", { type: "slideUp", dur: 30 }, 700),
        txt("s4-sub", "A peaceful holiday season\nand a prosperous New Year", 780, 120, 540, 680, 32, "#fcd34d", "center", { type: "fadeIn", dur: 25 }),
        txt("s4-divider", "━ ━ ━ ━ ━", 810, 60, 540, 860, 14, "#fbbf24"),
        txt("s4-company", overrides.company ?? "[Company Name]", 830, 70, 540, 960, 28, "#d4d4d8", "center", { type: "fadeIn", dur: 20 }),
        txt("s4-deco", "✦ ✦ ✦", 850, 50, 540, 1060, 18, "#fbbf24"),
        txt("s4-year", `\u00A9 ${overrides.year ?? "2025"} · ${overrides.company ?? "[Company]"}`, 870, 30, 540, 1600, 14, "#52525b", "center", { type: "fadeIn", dur: 15 }),
      ],
    },
  }),
};
