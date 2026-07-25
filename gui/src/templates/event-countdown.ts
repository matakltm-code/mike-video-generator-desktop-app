import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 1350; // 45s

export const eventCountdownTemplate: VideoTemplate = {
  id: "event-countdown",
  name: "Event Countdown",
  description:
    "45-second high-energy event invitation with countdown numbers, date details, speakers, and registration — perfect for conferences, webinars, and product launches.",
  duration: 45,
  category: "Social",
  color: "#0f172a",
  icon: "📅",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#0f172a",
      scenes: [
        { from: 0, color: "#0f172a" },
        { from: 180, color: "#1e1b4b" },
        { from: 480, color: "#0f172a" },
        { from: 780, color: "#1e1b4b" },
        { from: 1080, color: "#0f172a" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Event Name + Countdown
        txt("s1-badge", "● SAVE THE DATE", 15, 60, 540, 460, 16, "#818cf8", "center"),
        txt("s1-icon", "⬡", 30, 40, 540, 560, 40, "#6366f1"),
        txt("s1-event-name", overrides.eventName ?? "[Event Name]", 40, 150, 540, 640, 64, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s1-subtitle", overrides.subtitle ?? "The Future of [Industry]", 90, 100, 540, 760, 28, "#a5b4fc", "center", { type: "slideUp", dur: 25 }),

        // Scene 2: Date & Details
        txt("s2-label", "MARK YOUR CALENDAR", 190, 40, 540, 400, 16, "#818cf8", "center"),
        txt("s2-date-icon", "✦", 210, 30, 540, 480, 24, "#6366f1"),
        txt("s2-date", overrides.date ?? "June 15\u201317, 2025", 220, 120, 540, 560, 56, "#ffffff", "center", { type: "scaleIn", dur: 30 }, 700),
        txt("s2-time", overrides.time ?? "9:00 AM \u2013 5:00 PM EST", 260, 100, 540, 660, 26, "#c7d2fe", "center", { type: "slideUp", dur: 20 }),
        txt("s2-location-icon", "⬡", 290, 30, 540, 740, 18, "#6366f1"),
        txt("s2-location", overrides.location ?? "[Venue Name] \u00B7 [City, State]", 300, 100, 540, 800, 26, "#a5b4fc", "center", { type: "fadeIn", dur: 20 }),
        txt("s2-format", "In-person \u00B7 Virtual \u00B7 Hybrid", 340, 80, 540, 880, 20, "#6366f1", "center", { type: "fadeIn", dur: 15 }),
        txt("s2-countdown-label", "Limited seats available", 380, 60, 540, 960, 18, "#818cf8", "center", { type: "fadeIn", dur: 15 }),

        // Scene 3: Speakers / Highlights
        txt("s3-label", "FEATURING", 490, 40, 540, 400, 16, "#818cf8", "center"),
        txt("s3-headline", overrides.headline ?? "Industry Leaders &\nInnovators", 510, 120, 540, 520, 52, "#ffffff", "center", { type: "slideUp", dur: 30 }, 700),
        txt("s3-speaker1", overrides.speaker1 ?? "[Keynote Speaker]", 560, 70, 200, 720, 30, "#e0e7ff", "left", { type: "slideUp", dur: 20 }),
        txt("s3-speaker1-role", overrides.role1 ?? "[Title] at [Company]", 565, 70, 200, 770, 20, "#a5b4fc", "left", { type: "fadeIn", dur: 15 }),
        txt("s3-speaker2", overrides.speaker2 ?? "[Featured Speaker]", 630, 70, 200, 870, 30, "#e0e7ff", "left", { type: "slideUp", dur: 20 }),
        txt("s3-speaker2-role", overrides.role2 ?? "[Title] at [Company]", 635, 70, 200, 920, 20, "#a5b4fc", "left", { type: "fadeIn", dur: 15 }),
        txt("s3-speaker3", overrides.speaker3 ?? "[Panel Moderator]", 700, 70, 200, 1020, 30, "#e0e7ff", "left", { type: "slideUp", dur: 20 }),
        txt("s3-speaker3-role", overrides.role3 ?? "[Title] at [Company]", 705, 70, 200, 1070, 20, "#a5b4fc", "left", { type: "fadeIn", dur: 15 }),
        txt("s3-more", "+ More special guests to be announced", 760, 60, 200, 1180, 22, "#6366f1", "left", { type: "fadeIn", dur: 15 }),

        // Scene 4: Agenda / What to Expect
        txt("s4-label", "WHAT TO EXPECT", 790, 40, 540, 400, 16, "#818cf8", "center"),
        txt("s4-pt1", "✦  Keynote presentations from industry leaders", 820, 70, 200, 560, 26, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-pt2", "✦  Hands-on workshops & breakout sessions", 880, 70, 200, 660, 26, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-pt3", "✦  Networking with 500+ professionals", 940, 70, 200, 760, 26, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-pt4", "✦  Exclusive product previews & demos", 1000, 70, 200, 860, 26, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-pt5", "✦  After-party & community celebration", 1060, 70, 200, 960, 26, "#e2e8f0", "left", { type: "slideUp", dur: 20 }),
        txt("s4-testimonial", "\"Last year's event changed everything for our startup\"", 1100, 80, 200, 1120, 22, "#818cf8", "left", { type: "fadeIn", dur: 20 }),

        // Scene 5: CTA + Countdown
        txt("s5-cta", overrides.cta ?? "Register Now", 1100, 200, 540, 640, 64, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s5-sub", "Early bird pricing ends soon", 1150, 150, 540, 750, 28, "#a5b4fc", "center", { type: "slideUp", dur: 20 }),
        txt("s5-divider", "━ ━ ━ ━ ━", 1180, 60, 540, 860, 14, "#6366f1"),
        txt("s5-date-line1", overrides.date ?? "June 15\u201317, 2025", 1210, 100, 540, 960, 26, "#c7d2fe", "center", { type: "fadeIn", dur: 20 }),
        txt("s5-date-line2", overrides.location ?? "[Venue] \u00B7 [City]", 1240, 100, 540, 1020, 22, "#818cf8", "center", { type: "fadeIn", dur: 20 }),
        txt("s5-footer", `${overrides.eventName ?? "[Event Name]"} \u00B7 www.example.com/register`, 1280, 70, 540, 1600, 16, "#475569", "center", { type: "fadeIn", dur: 15 }),
      ],
    },
  }),
};
