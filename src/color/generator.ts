import { createHash } from "node:crypto";
import { Oklch, Rgb, foregroundFor, oklchToRgb, rgbToHex } from "./oklch";

export interface ColorCandidate {
  hex: string;
  oklch: Oklch;
  rgb: Rgb;
  foreground: "#000000" | "#ffffff";
}

// Bright, digital colour families inspired by the Footprint visual identity.
// The palette is intentionally stable for algorithm version 1.
const PALETTE = [
  0, 20, 42, 70, 105, 140, 165, 190, 215, 245, 275, 300, 325, 345
];

const ALGORITHM_VERSION = "footprint:v1:";

export function generateCandidates(identity: string, count = 24): ColorCandidate[] {
  return Array.from({ length: count }, (_, index) => {
    const d = createHash("sha256")
      .update(`${ALGORITHM_VERSION}${identity}:${index}`)
      .digest();

    const hue =
      (PALETTE[d.readUInt16BE(0) % PALETTE.length] +
        ((d[2] / 255) - 0.5) * 10 +
        360) %
      360;

    const oklch: Oklch = {
      l: 0.62 + (d[3] / 255) * 0.055,
      c: 0.075 + (d[4] / 255) * 0.035,
      h: hue
    };

    const rgb = oklchToRgb(oklch);
    return {
      oklch,
      rgb,
      hex: rgbToHex(rgb),
      foreground: foregroundFor(rgb)
    };
  });
}
