import { useCurrentFrame, interpolate, interpolateColors, AbsoluteFill } from "remotion";
import type { TextElement as TextElementType } from "../types";

interface TextElementProps {
  element: TextElementType;
  fps: number;
}

export const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const frame = useCurrentFrame();
  const { animation, style, position, opacity = 1 } = element;

  let animatedOpacity = opacity;
  let transform = "translate(0px, 0px) scale(1)";

  if (animation && frame < animation.durationInFrames) {
    const progress = interpolate(
      frame,
      [0, animation.durationInFrames],
      [0, 1],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );

    switch (animation.type) {
      case "fadeIn":
        animatedOpacity = interpolate(progress, [0, 1], [0, opacity]);
        break;

      case "slideUp":
        animatedOpacity = interpolate(progress, [0, 1], [0, opacity]);
        const translateY = interpolate(progress, [0, 1], [50, 0]);
        transform = `translate(0px, ${translateY}px) scale(1)`;
        break;

      case "scaleIn":
        animatedOpacity = interpolate(progress, [0, 1], [0, opacity]);
        const scale = interpolate(progress, [0, 1], [0.5, 1]);
        transform = `translate(0px, 0px) scale(${scale})`;
        break;
    }
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          opacity: animatedOpacity,
          transform,
          fontSize: style.fontSize,
          color: style.color,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight ?? 400,
          textAlign: style.textAlign ?? "left",
          whiteSpace: "pre-wrap",
          lineHeight: 1.2,
          maxWidth: "80%",
          wordBreak: "break-word",
        }}
      >
        {element.text}
      </div>
    </AbsoluteFill>
  );
};
