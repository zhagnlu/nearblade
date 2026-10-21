import toolingDetails from "../../content/catalog/tooling-details.json";
import bladeDetails from "../../content/catalog/blade-details.json";
import type { ToolingProfile } from "@/components/common/ToolingProfileDrawing";
import type { BladeProfile } from "@/components/common/BladeProfileDrawing";

export type DrawingKind = "straight" | "circular" | "tooling" | "toothed" | "strip";

export interface ProductGuide {
  drawing: DrawingKind;
  dimensions: { label: string; detail: string }[];
  compatibility: string;
  inspection: string[];
  catalogImage: string;
  toolingProfile?: ToolingProfile;
  process?: string;
  role?: string;
  bladeProfile?: BladeProfile;
  overview?: boolean;
}

export const productGuides: Record<string, ProductGuide> = {
  ...(bladeDetails as unknown as Record<string, ProductGuide>),
  ...(toolingDetails as unknown as Record<string, ProductGuide>),
  "pb-001": {
    drawing: "tooling",
    dimensions: [
      { label: "Length and sections · L", detail: "Specify total working length and individual segment lengths, including any special end sections." },
      { label: "Tool type and working profile", detail: "Identify the tool type first. Supply punch angle and tip radius, die opening and shoulder radii, forming-cavity profile or clamp interfaces as applicable." },
      { label: "Clamping interface", detail: "Supply the tang and mounting-interface drawing, machine model and clamping-system details." },
    ],
    compatibility: "Confirm the press-brake clamping interface, working height and required tooling profile with your machine specifications. Include the sheet material, thickness and bend drawing.",
    inspection: ["Mark the profile dimensions and working datums to be inspected.", "Specify segment alignment and working-height requirements.", "Confirm application and load requirements with the tooling proposal."],
    catalogImage: "/images/manual/press-brake-profiles.webp",
  },
};
