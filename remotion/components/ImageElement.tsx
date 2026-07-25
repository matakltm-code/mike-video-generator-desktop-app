import { Img, AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { ImageElement as ImageElementType } from "../types";

interface ImageElementProps {
  element: ImageElementType;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const frame = useCurrentFrame();
  const { position, size, opacity = 1 } = element;

  // Simple fade-in
  const currentOpacity = interpolate(frame, [0, 15], [0, opacity], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
      {element.src ? (
        <Img
          src={element.src}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: size?.width ?? "auto",
            height: size?.height ?? "auto",
            opacity: currentOpacity,
            objectFit: size?.objectFit ?? "contain",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: size?.width ?? 200,
            height: size?.height ?? 200,
            background: "#333",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: 14,
          }}
        >
          No image
        </div>
      )}
    </AbsoluteFill>
  );
};
