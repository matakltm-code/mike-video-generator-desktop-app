/**
 * Curated catalog of free stock media resources.
 * Images use picsum.photos (free, no API key).
 * Audio is sourced from the Internet Archive / CC0 repositories.
 */

// ─── Types ────────────────────────────────────────────────────────────

export interface StockImage {
  id: string;
  title: string;
  category: ImageCategory;
  url: string;
  thumbUrl: string;
  attribution?: string;
  tags: string[];
}

export interface StockAudio {
  id: string;
  title: string;
  category: AudioCategory;
  url: string;
  duration: string;
  mood: string;
  attribution: string;
}

export type ImageCategory =
  | "backgrounds"
  | "nature"
  | "business"
  | "technology"
  | "abstract"
  | "city"
  | "people";

export type AudioCategory = "background" | "corporate" | "upbeat" | "calm" | "cinematic" | "loops";

export interface MediaCategory<T> {
  id: string;
  label: string;
  icon: string;
  items: T[];
}

// ─── Helper: generate picsum URL with seed ────────────────────────────

/** Generate picsum URL with consistent seed. Returns both full-res and thumbnail URLs. */
function img(seed: string, w = 1080, h = 1920): { url: string; thumbUrl: string } {
  return {
    url: `https://picsum.photos/seed/${seed}/${w}/${h}`,
    thumbUrl: `https://picsum.photos/seed/${seed}/400/600`,
  };
}

// ─── Stock Images ─────────────────────────────────────────────────────

export const STOCK_IMAGES: StockImage[] = [
  // Backgrounds
  { id: "bg-dark", title: "Dark Abstract", category: "backgrounds", ...img("dark-abstract", 1080, 1920), tags: ["dark", "abstract", "bg"] },
  { id: "bg-gradient", title: "Purple Gradient", category: "backgrounds", ...img("gradient-purple", 1080, 1920), tags: ["gradient", "purple"] },
  { id: "bg-blue", title: "Blue Texture", category: "backgrounds", ...img("blue-texture", 1080, 1920), tags: ["blue", "texture"] },
  { id: "bg-minimal", title: "Minimal Light", category: "backgrounds", ...img("minimal-light", 1080, 1920), tags: ["minimal", "light", "clean"] },
  { id: "bg-geometric", title: "Geometric Pattern", category: "backgrounds", ...img("geometric-pattern", 1080, 1920), tags: ["geometric", "pattern"] },
  { id: "bg-warm", title: "Warm Sunset", category: "backgrounds", ...img("warm-sunset", 1080, 1920), tags: ["warm", "sunset", "gradient"] },

  // Nature
  { id: "nat-mountain", title: "Mountain Peak", category: "nature", ...img("mountain-peak"), tags: ["mountain", "landscape"] },
  { id: "nat-forest", title: "Forest Light", category: "nature", ...img("forest-light"), tags: ["forest", "nature", "green"] },
  { id: "nat-ocean", title: "Ocean Waves", category: "nature", ...img("ocean-waves"), tags: ["ocean", "water", "blue"] },
  { id: "nat-sky", title: "Starry Night", category: "nature", ...img("starry-night"), tags: ["stars", "night", "sky"] },
  { id: "nat-leaves", title: "Green Leaves", category: "nature", ...img("green-leaves"), tags: ["leaves", "nature", "fresh"] },
  { id: "nat-sunset", title: "Golden Sunset", category: "nature", ...img("golden-sunset"), tags: ["sunset", "golden", "warm"] },

  // Business
  { id: "biz-meeting", title: "Team Meeting", category: "business", ...img("team-meeting"), tags: ["business", "meeting", "team"] },
  { id: "biz-office", title: "Modern Office", category: "business", ...img("modern-office"), tags: ["office", "workspace"] },
  { id: "biz-handshake", title: "Partnership", category: "business", ...img("partnership"), tags: ["handshake", "deal", "trust"] },
  { id: "biz-presentation", title: "Presentation", category: "business", ...img("presentation"), tags: ["presentation", "boardroom"] },
  { id: "biz-laptop", title: "Remote Work", category: "business", ...img("remote-work"), tags: ["laptop", "remote", "work"] },
  { id: "biz-growth", title: "Growth Chart", category: "business", ...img("growth-chart"), tags: ["chart", "growth", "data"] },

  // Technology
  { id: "tech-code", title: "Code Screen", category: "technology", ...img("code-screen"), tags: ["code", "developer", "tech"] },
  { id: "tech-data", title: "Data Center", category: "technology", ...img("data-center"), tags: ["servers", "data", "cloud"] },
  { id: "tech-ai", title: "AI Network", category: "technology", ...img("ai-network"), tags: ["ai", "network", "digital"] },
  { id: "tech-robot", title: "Robotics", category: "technology", ...img("robotics"), tags: ["robot", "automation"] },
  { id: "tech-circuit", title: "Circuit Board", category: "technology", ...img("circuit-board"), tags: ["circuit", "hardware"] },
  { id: "tech-globe", title: "Digital Globe", category: "technology", ...img("digital-globe"), tags: ["globe", "global", "tech"] },

  // Abstract
  { id: "abs-waves", title: "Sound Waves", category: "abstract", ...img("sound-waves", 1080, 1920), tags: ["waves", "audio", "abstract"] },
  { id: "abs-neon", title: "Neon Lights", category: "abstract", ...img("neon-lights", 1080, 1920), tags: ["neon", "lights", "vibrant"] },
  { id: "abs-particle", title: "Particle Field", category: "abstract", ...img("particle-field", 1080, 1920), tags: ["particles", "dots", "tech"] },
  { id: "abs-mesh", title: "Color Mesh", category: "abstract", ...img("color-mesh", 1080, 1920), tags: ["mesh", "gradient", "colorful"] },

  // City
  { id: "city-skyline", title: "City Skyline", category: "city", ...img("city-skyline"), tags: ["city", "skyline", "urban"] },
  { id: "city-street", title: "Night Street", category: "city", ...img("night-street"), tags: ["night", "street", "lights"] },
  { id: "city-bridge", title: "Golden Bridge", category: "city", ...img("golden-bridge"), tags: ["bridge", "architecture"] },
  { id: "city-architecture", title: "Modern Building", category: "city", ...img("modern-building"), tags: ["building", "glass", "modern"] },

  // People
  { id: "ppl-diverse", title: "Diverse Team", category: "people", ...img("diverse-team"), tags: ["team", "diverse", "people"] },
  { id: "ppl-creative", title: "Creative Workspace", category: "people", ...img("creative-workspace"), tags: ["creative", "design", "studio"] },
  { id: "ppl-outdoor", title: "Outdoor Meeting", category: "people", ...img("outdoor-meeting"), tags: ["outdoor", "casual", "meeting"] },
  { id: "ppl-celebration", title: "Team Celebration", category: "people", ...img("team-celebration"), tags: ["celebration", "happy", "team"] },
];

// ─── Stock Audio ──────────────────────────────────────────────────────

export const STOCK_AUDIO: StockAudio[] = [
  {
    id: "audio-inspiring",
    title: "Inspiring Ambient",
    category: "background",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "5:14",
    mood: "Inspiring",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-corporate",
    title: "Corporate Uplifting",
    category: "corporate",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:35",
    mood: "Uplifting",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-calm",
    title: "Calm Piano",
    category: "calm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "6:02",
    mood: "Calm",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-energetic",
    title: "Energetic Drive",
    category: "upbeat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:48",
    mood: "Energetic",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-cinematic",
    title: "Cinematic Epic",
    category: "cinematic",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "7:12",
    mood: "Epic",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-lofi",
    title: "Lo-Fi Study",
    category: "background",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: "4:20",
    mood: "Chill",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-ambient",
    title: "Ambient Texture",
    category: "calm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: "3:55",
    mood: "Dreamy",
    attribution: "SoundHelix (CC BY 3.0)",
  },
  {
    id: "audio-happy",
    title: "Happy Pop",
    category: "upbeat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "3:30",
    mood: "Happy",
    attribution: "SoundHelix (CC BY 3.0)",
  },
];

// ─── Grouped categories for the UI ─────────────────────────────────────

export const IMAGE_CATEGORIES: MediaCategory<StockImage>[] = [
  { id: "backgrounds", label: "Backgrounds", icon: "🎨", items: STOCK_IMAGES.filter((i) => i.category === "backgrounds") },
  { id: "nature", label: "Nature", icon: "🌿", items: STOCK_IMAGES.filter((i) => i.category === "nature") },
  { id: "business", label: "Business", icon: "💼", items: STOCK_IMAGES.filter((i) => i.category === "business") },
  { id: "technology", label: "Technology", icon: "⚡", items: STOCK_IMAGES.filter((i) => i.category === "technology") },
  { id: "abstract", label: "Abstract", icon: "✨", items: STOCK_IMAGES.filter((i) => i.category === "abstract") },
  { id: "city", label: "City & Urban", icon: "🏙️", items: STOCK_IMAGES.filter((i) => i.category === "city") },
  { id: "people", label: "People", icon: "👥", items: STOCK_IMAGES.filter((i) => i.category === "people") },
];

export const AUDIO_CATEGORIES: MediaCategory<StockAudio>[] = [
  { id: "background", label: "Background", icon: "🎵", items: STOCK_AUDIO.filter((a) => a.category === "background") },
  { id: "corporate", label: "Corporate", icon: "🏢", items: STOCK_AUDIO.filter((a) => a.category === "corporate") },
  { id: "upbeat", label: "Upbeat", icon: "🎉", items: STOCK_AUDIO.filter((a) => a.category === "upbeat") },
  { id: "calm", label: "Calm & Relaxing", icon: "🧘", items: STOCK_AUDIO.filter((a) => a.category === "calm") },
  { id: "cinematic", label: "Cinematic", icon: "🎬", items: STOCK_AUDIO.filter((a) => a.category === "cinematic") },
];
