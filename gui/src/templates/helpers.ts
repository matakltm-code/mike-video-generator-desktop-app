/**
 * Shared helper: create a text element with consistent defaults.
 * Used by all templates for maintainability and DRY templates.
 */
export function txt(
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
) {
  return {
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
    animation: anim
      ? { type: anim.type, durationInFrames: anim.dur }
      : undefined,
  };
}
