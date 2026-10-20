import toolingDetails from "../../content/catalog/tooling-details.json";
import type { ToolingProfile } from "@/components/common/ToolingProfileDrawing";

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
}

const straightDimensions = [
  { label: "Overall size · L × W × T", detail: "Specify overall length, width and thickness in mm. Custom size and material combinations are confirmed with the quotation." },
  { label: "Mounting holes · d / P / E", detail: "Include hole diameter or thread, center-to-center pitch, first-hole offset, quantity and any countersinks." },
  { label: "Cutting edge", detail: "Show the bevel angle, number of usable edges and upper / lower knife positions on the drawing." },
];

export const productGuides: Record<string, ProductGuide> = {
  "sb-001": {
    drawing: "straight",
    dimensions: straightDimensions,
    compatibility: "Send the shearing-machine manufacturer, model and the existing upper / lower blade drawing. Match the mounting pattern and edge geometry before confirming a replacement.",
    inspection: ["Identify the dimensions controlled by the quoted tolerance.", "State straightness, flatness and parallelism requirements separately.", "Confirm material, hardness and inspection documentation with the approved drawing."],
    catalogImage: "/images/manual/shear-blades-detail.webp",
  },
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
  "rs-001": {
    drawing: "circular",
    dimensions: [
      { label: "Main dimensions · D × d × T", detail: "Specify outside diameter, bore diameter and thickness in mm." },
      { label: "Mounting details", detail: "Show any keyways, bolt holes, recesses and locating features, together with their datums." },
      { label: "Edge and knife set", detail: "Provide the edge profile and identify upper / lower knives or matched pairs where applicable." },
    ],
    compatibility: "Provide the rolling-shear machine model, arbor or mounting drawing and the material and thickness being processed. Confirm the complete knife-set arrangement.",
    inspection: ["Identify diameter, bore and thickness tolerances separately.", "State any flatness, parallelism and runout requirements on the drawing.", "Confirm matched-set identification and inspection records when required."],
    catalogImage: "/images/manual/rolling-shear-blades.webp",
  },
  "sk-001": {
    drawing: "circular",
    dimensions: [
      { label: "Main dimensions · D × d × T", detail: "Send outside diameter, bore diameter and thickness, together with the required quantities." },
      { label: "Edge geometry", detail: "Show the cutting-edge profile and bevel direction; include an existing part drawing when available." },
      { label: "Arbor and set arrangement", detail: "Specify locating features, keyways and the knife / spacer arrangement used by your slitting line." },
    ],
    compatibility: "Describe the material being slit, its thickness and the slitting-line model. Provide the knife and spacer drawings and any application-specific edge requirements.",
    inspection: ["Identify the thickness or other dimension to which a precision requirement applies.", "Specify flatness, parallelism, bore fit and runout requirements separately.", "Confirm how matched knives will be measured and identified."],
    catalogImage: "/images/manual/slitting-knives.webp",
  },
  "tb-002": {
    drawing: "toothed",
    dimensions: [
      { label: "Blade body · L × W × T", detail: "Provide the overall envelope, thickness and a drawing of any curved or special body profile." },
      { label: "Tooth profile · P / h", detail: "Specify tooth pitch, tooth height, tooth count and tip / root shape. Attach a profile drawing or sample photos." },
      { label: "Mounting pattern", detail: "Dimension every hole or slot from a clear datum and show the cutting direction." },
    ],
    compatibility: "Identify the packaging or converting machine, cutting position and material being processed. Match the tooth pattern and mounting geometry to the existing part.",
    inspection: ["Separate tooth-profile requirements from body and mounting tolerances.", "Confirm the tip shape and cutting direction before approving the drawing.", "Specify material and treatment requirements for the application."],
    catalogImage: "/images/manual/toothed-blades.webp",
  },
  "db-001": {
    drawing: "strip",
    dimensions: [
      { label: "Strip dimensions · L × W × T", detail: "Specify blade width and thickness, plus cut length or the required coil format and quantity." },
      { label: "Metering edge", detail: "Provide the lamella or bevel profile, working-edge dimensions and any coating requirement." },
      { label: "Holder and delivery format", detail: "Identify the blade holder, required edge orientation and whether the order is for strips or coils." },
    ],
    compatibility: "Send the printing or coating machine and blade-holder details, printing process and ink or coating type. Include the existing blade specification when available.",
    inspection: ["Identify strip-thickness and working-edge dimensions separately.", "Confirm the edge profile and surface requirements with the sample or drawing.", "Specify strip / coil identification and packaging requirements."],
    catalogImage: "/images/manual/doctor-blades.webp",
  },
};

productGuides["cp-001"] = {
  ...productGuides["tb-002"],
  catalogImage: "/images/manual/corrugated-cutting-blades.jpg",
};
for (const id of ["sr-001", "cb-001", "cr-001"]) {
  productGuides[id] = {
    ...productGuides["sb-001"],
    compatibility: "Provide the machine model, blade position, processed material and mounting drawing.",
  };
}

Object.assign(productGuides, toolingDetails as unknown as Record<string, ProductGuide>);
