import type { VideoTemplate } from "../../../shared/VideoConfig";
import { brandStoryTemplate } from "./brand-story";
import { featureShowcaseTemplate } from "./feature-showcase";
import { quickAnnouncementTemplate } from "./quick-announcement";
import { tipsListicleTemplate } from "./tips-listicle";

/**
 * All available video templates.
 * When a user selects one, its `generate()` method is called to
 * produce a fully-populated VideoConfig with placeholder text.
 */
export const TEMPLATES: VideoTemplate[] = [
  brandStoryTemplate,
  featureShowcaseTemplate,
  quickAnnouncementTemplate,
  tipsListicleTemplate,
];

export type { VideoTemplate };
