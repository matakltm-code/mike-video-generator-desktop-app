import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 2700; // 90s

export const howToTutorialTemplate: VideoTemplate = {
  id: "how-to-tutorial",
  name: "How-To Tutorial",
  description:
    "90-second educational tutorial with 5 numbered steps, progress indicators, tip callouts, and a summary — great for how-tos, DIY, guides, and educational content.",
  duration: 90,
  category: "Educational",
  color: "#0a0a1a",
  icon: "📖",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#0a0a1a",
      scenes: [
        { from: 0, color: "#0a0a1a" },
        { from: 240, color: "#1a1a2e" },
        { from: 660, color: "#0a0a1a" },
        { from: 1080, color: "#1a1a2e" },
        { from: 1500, color: "#0a0a1a" },
        { from: 1920, color: "#1a1a2e" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Intro
        txt("s1-badge", "● STEP-BY-STEP GUIDE", 15, 60, 540, 500, 16, "#38bdf8", "center"),
        txt("s1-headline", overrides.topic ?? "How to [Achieve Goal]\nin 5 Simple Steps", 30, 150, 540, 620, 60, "#ffffff", "center", { type: "slideUp", dur: 35 }, 700),
        txt("s1-sub", overrides.subtitle ?? "No experience required. Start today.", 90, 100, 540, 800, 26, "#94a3b8", "center", { type: "fadeIn", dur: 25 }),
        txt("s1-difficulty", "● Beginner Friendly", 120, 60, 540, 880, 18, "#38bdf8", "center", { type: "fadeIn", dur: 20 }),
        txt("s1-divider", "━ ━ ━ ━ ━", 140, 60, 540, 960, 14, "#334155"),
        txt("s1-eta", "Takes about 15 minutes", 160, 60, 540, 1020, 20, "#64748b", "center", { type: "fadeIn", dur: 15 }),

        // Scene 2: Step 1
        txt("s2-step-num", "01", 250, 40, 160, 480, 32, "#38bdf8", "left", undefined, 700),
        txt("s2-step-progress", "Step 1 of 5", 255, 40, 160, 540, 14, "#64748b", "left"),
        txt("s2-title", overrides.step1Title ?? "Gather Your Materials", 280, 140, 160, 620, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
        txt("s2-desc", overrides.step1 ?? "Start by collecting everything you'll need. Having your tools ready beforehand makes the process smooth and frustration-free.", 310, 180, 160, 740, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s2-tip-label", "● PRO TIP", 360, 60, 160, 960, 16, "#38bdf8", "left"),
        txt("s2-tip", overrides.tip1 ?? "Keep a checklist handy to track your progress.", 370, 100, 160, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s2-arrow", "▸", 460, 40, 160, 1120, 18, "#475569"),

        // Scene 3: Step 2
        txt("s3-step-num", "02", 670, 40, 160, 480, 32, "#38bdf8", "left", undefined, 700),
        txt("s3-step-progress", "Step 2 of 5", 675, 40, 160, 540, 14, "#64748b", "left"),
        txt("s3-title", overrides.step2Title ?? "Prepare Your Workspace", 700, 140, 160, 620, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
        txt("s3-desc", overrides.step2 ?? "Set up a clean, organized workspace with good lighting. A clutter-free environment helps you focus and work more efficiently.", 730, 180, 160, 740, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s3-tip-label", "● PRO TIP", 780, 60, 160, 960, 16, "#38bdf8", "left"),
        txt("s3-tip", overrides.tip2 ?? "Natural lighting makes a huge difference in quality.", 790, 100, 160, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s3-arrow", "▸", 880, 40, 160, 1120, 18, "#475569"),

        // Scene 4: Step 3
        txt("s4-step-num", "03", 1090, 40, 160, 480, 32, "#38bdf8", "left", undefined, 700),
        txt("s4-step-progress", "Step 3 of 5", 1095, 40, 160, 540, 14, "#64748b", "left"),
        txt("s4-title", overrides.step3Title ?? "Follow the Core Process", 1120, 140, 160, 620, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
        txt("s4-desc", overrides.step3 ?? "Work through each phase methodically. Pay attention to the details — they're what separate good results from exceptional ones.", 1150, 180, 160, 740, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s4-tip-label", "● PRO TIP", 1200, 60, 160, 960, 16, "#38bdf8", "left"),
        txt("s4-tip", overrides.tip3 ?? "Take breaks between steps to maintain quality.", 1210, 100, 160, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s4-arrow", "▸", 1300, 40, 160, 1120, 18, "#475569"),

        // Scene 5: Step 4
        txt("s5-step-num", "04", 1510, 40, 160, 480, 32, "#38bdf8", "left", undefined, 700),
        txt("s5-step-progress", "Step 4 of 5", 1515, 40, 160, 540, 14, "#64748b", "left"),
        txt("s5-title", overrides.step4Title ?? "Review & Refine", 1540, 140, 160, 620, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
        txt("s5-desc", overrides.step4 ?? "Step back and evaluate your progress. Make adjustments where needed. This is where good work becomes great work.", 1570, 180, 160, 740, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s5-tip-label", "● PRO TIP", 1620, 60, 160, 960, 16, "#38bdf8", "left"),
        txt("s5-tip", overrides.tip4 ?? "Ask a colleague for a second opinion.", 1630, 100, 160, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),
        txt("s5-arrow", "▸", 1720, 40, 160, 1120, 18, "#475569"),

        // Scene 6: Step 5 + Summary
        txt("s6-step-num", "05", 1930, 40, 160, 480, 32, "#38bdf8", "left", undefined, 700),
        txt("s6-step-progress", "Final Step", 1935, 40, 160, 540, 14, "#64748b", "left"),
        txt("s6-title", overrides.step5Title ?? "Share Your Results", 1960, 140, 160, 620, 48, "#ffffff", "left", { type: "slideUp", dur: 30 }, 600),
        txt("s6-desc", overrides.step5 ?? "Share what you've created with the community. Feedback helps you improve and inspires others to start their own journey.", 1990, 180, 160, 740, 26, "#cbd5e1", "left", { type: "fadeIn", dur: 25 }),
        txt("s6-tip-label", "● PRO TIP", 2040, 60, 160, 960, 16, "#38bdf8", "left"),
        txt("s6-tip", overrides.tip5 ?? "Before and after photos get the most engagement.", 2050, 100, 160, 1000, 22, "#94a3b8", "left", { type: "fadeIn", dur: 20 }),

        // Scene 7: Recap
        txt("s7-label", "RECAP", 2140, 40, 540, 420, 16, "#38bdf8", "center"),
        txt("s7-recap1", "01  Gather your materials", 2180, 70, 200, 560, 28, "#e2e8f0", "left", { type: "fadeIn", dur: 15 }),
        txt("s7-recap2", "02  Prepare your workspace", 2240, 70, 200, 640, 28, "#e2e8f0", "left", { type: "fadeIn", dur: 15 }),
        txt("s7-recap3", "03  Follow the core process", 2300, 70, 200, 720, 28, "#e2e8f0", "left", { type: "fadeIn", dur: 15 }),
        txt("s7-recap4", "04  Review and refine", 2360, 70, 200, 800, 28, "#e2e8f0", "left", { type: "fadeIn", dur: 15 }),
        txt("s7-recap5", "05  Share your results", 2420, 70, 200, 880, 28, "#e2e8f0", "left", { type: "fadeIn", dur: 15 }),
        txt("s7-cta", overrides.cta ?? "Share Your Creation", 2500, 160, 540, 1080, 52, "#ffffff", "center", { type: "scaleIn", dur: 35 }, 700),
        txt("s7-tag", `#${(overrides.hashtag ?? "MadeWith").replace(/^#/, "")}`, 2560, 140, 540, 1600, 18, "#475569", "center", { type: "fadeIn", dur: 20 }),
      ],
    },
  }),
};
