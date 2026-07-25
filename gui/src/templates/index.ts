import type { VideoTemplate } from "../../../shared/VideoConfig";
import { brandStoryTemplate } from "./brand-story";
import { featureShowcaseTemplate } from "./feature-showcase";
import { quickAnnouncementTemplate } from "./quick-announcement";
import { tipsListicleTemplate } from "./tips-listicle";
import { salesPitchTemplate } from "./sales-pitch";
import { eventCountdownTemplate } from "./event-countdown";
import { howToTutorialTemplate } from "./how-to-tutorial";
import { teamIntroTemplate } from "./team-intro";
import { yearInReviewTemplate } from "./year-in-review";
import { holidayGreetingTemplate } from "./holiday-greeting";

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
  salesPitchTemplate,
  eventCountdownTemplate,
  howToTutorialTemplate,
  teamIntroTemplate,
  yearInReviewTemplate,
  holidayGreetingTemplate,
];

export type { VideoTemplate };
