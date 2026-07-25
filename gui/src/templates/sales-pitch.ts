import type { VideoConfig, VideoTemplate } from "../../../shared/VideoConfig";
import { txt } from "./helpers";

const FPS = 30;
const DURATION = 1800; // 60s

export const salesPitchTemplate: VideoTemplate = {
  id: "sales-pitch",
  name: "Sales Pitch",
  description:
    "60-second customer testimonial video with quote cards, trust signals, logos, and a compelling call to action — perfect for service-based businesses and B2B.",
  duration: 60,
  category: "Product",
  color: "#1c1917",
  icon: "💬",
  generate: (overrides = {}): VideoConfig => ({
    version: "1.0",
    canvas: {
      width: 1080, height: 1920, fps: FPS, durationInFrames: DURATION,
      backgroundColor: "#1c1917",
      scenes: [
        { from: 0, color: "#1c1917" },
        { from: 240, color: "#292524" },
        { from: 540, color: "#1c1917" },
        { from: 840, color: "#292524" },
        { from: 1140, color: "#1c1917" },
        { from: 1440, color: "#292524" },
      ],
    },
    tracks: {
      audio: [],
      elements: [
        // Scene 1: Hook
        txt("s1-badge", "● CUSTOMER STORY", 15, 60, 540, 460, 16, "#a8a29e", "center"),
        txt("s1-headline", overrides.headline ?? "How We Helped\n[Client Name] Scale 3×", 30, 150, 540, 580, 68, "#ffffff", "center", { type: "slideUp", dur: 35 }, 700),
        txt("s1-sub", "From struggling to thriving in 6 months", 90, 100, 540, 780, 26, "#d6d3d1", "center", { type: "fadeIn", dur: 25 }),
        txt("s1-quote", "\u201C", 120, 60, 540, 880, 56, "#78716c"),
        txt("s1-tag", "Trusted by industry leaders", 150, 60, 540, 960, 18, "#a8a29e", "center", { type: "fadeIn", dur: 20 }),

        // Scene 2: The Challenge
        txt("s2-label", "THE CHALLENGE", 250, 40, 200, 500, 18, "#a8a29e", "left"),
        txt("s2-quote-open", "\u201C", 270, 40, 160, 600, 40, "#78716c"),
        txt("s2-quote-text", overrides.challenge ?? "We were struggling with manual processes that couldn't keep up with our growth. Every month, we lost hours to repetitive tasks.", 280, 180, 200, 660, 30, "#f5f5f4", "left", { type: "fadeIn", dur: 30 }),
        txt("s2-attribution", "\u2014 [Client Name], CEO", 370, 80, 200, 900, 22, "#a8a29e", "left", { type: "fadeIn", dur: 20 }),
        txt("s2-icon", "▸", 440, 60, 200, 1020, 18, "#78716c"),

        // Scene 3: The Solution
        txt("s3-label", "OUR SOLUTION", 550, 40, 540, 400, 16, "#a8a29e", "center"),
        txt("s3-headline", overrides.solution ?? "Automated their entire workflow", 570, 120, 540, 520, 56, "#ffffff", "center", { type: "slideUp", dur: 30 }, 700),
        txt("s3-point1", "→  Reduced manual work by 85%", 620, 70, 200, 740, 28, "#e7e5e4", "left", { type: "slideUp", dur: 20 }),
        txt("s3-point2", "→  Real-time analytics dashboard", 690, 70, 200, 820, 28, "#e7e5e4", "left", { type: "slideUp", dur: 20 }),
        txt("s3-point3", "→  Seamless team collaboration", 760, 70, 200, 900, 28, "#e7e5e4", "left", { type: "slideUp", dur: 20 }),
        txt("s3-result", "3 months to see a 40% increase in productivity", 830, 100, 200, 1020, 24, "#a8a29e", "left", { type: "fadeIn", dur: 25 }),

        // Scene 4: Results
        txt("s4-label", "THE RESULTS", 850, 40, 540, 400, 16, "#a8a29e", "center"),
        txt("s4-stat1", "3×", 880, 100, 200, 560, 80, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-stat1-label", "Faster Growth", 890, 100, 200, 670, 28, "#d6d3d1", "left", { type: "slideUp", dur: 20 }),
        txt("s4-stat2", "85%", 970, 100, 200, 820, 80, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-stat2-label", "Less Manual Work", 980, 100, 200, 930, 28, "#d6d3d1", "left", { type: "slideUp", dur: 20 }),
        txt("s4-stat3", "40%", 1060, 100, 200, 1080, 80, "#ffffff", "left", { type: "scaleIn", dur: 30 }, 800),
        txt("s4-stat3-label", "Productivity Increase", 1070, 100, 200, 1190, 28, "#d6d3d1", "left", { type: "slideUp", dur: 20 }),

        // Scene 5: Testimonial Close
        txt("s5-label", "WHAT THEY SAY", 1150, 40, 200, 400, 18, "#a8a29e", "left"),
        txt("s5-quote-open", "\u201C", 1170, 40, 160, 500, 40, "#78716c"),
        txt("s5-quote-text", overrides.testimonial ?? "This platform completely transformed how we operate. I can't imagine going back to the way we worked before.", 1180, 180, 200, 560, 30, "#f5f5f4", "left", { type: "fadeIn", dur: 30 }),
        txt("s5-attribution", `\u2014 ${overrides.client ?? "[Client Name]"}, ${overrides.role ?? "[Role]"}`, 1270, 80, 200, 800, 22, "#a8a29e", "left", { type: "fadeIn", dur: 20 }),
        txt("s5-rating", "★★★★★", 1300, 60, 200, 900, 24, "#f59e0b", "left", { type: "fadeIn", dur: 15 }),

        // Scene 6: CTA
        txt("s6-cta", overrides.cta ?? "Start Your Success Story", 1460, 240, 540, 680, 64, "#ffffff", "center", { type: "scaleIn", dur: 40 }, 700),
        txt("s6-sub", "Join 500+ businesses already growing with us", 1510, 160, 540, 800, 26, "#a8a29e", "center", { type: "fadeIn", dur: 25 }),
        txt("s6-divider", "━ ━ ━ ━ ━", 1540, 60, 540, 920, 14, "#57534e"),
        txt("s6-cta-btn", "→  Book a Demo Today  ←", 1570, 160, 540, 1000, 28, "#d6d3d1", "center", { type: "fadeIn", dur: 20 }),
        txt("s6-footer", "No commitment · Free consultation", 1620, 180, 540, 1600, 18, "#57534e", "center", { type: "fadeIn", dur: 20 }),
      ],
    },
  }),
};
