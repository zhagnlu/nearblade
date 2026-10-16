import { useId } from "react";
import type { DrawingKind } from "@/data/productGuides";

export function BladeDimensionDrawing({ kind }: { kind: DrawingKind }) {
  const arrowId = `dimension-arrow-${useId().replace(/:/g, "")}`;
  const arrow = `url(#${arrowId})`;
  const dimension = (x1: number, y1: number, x2: number, y2: number, label: string, tx: number, ty: number) => (
    <g stroke="#A65315" strokeWidth="1.5">
      <line x1={x1} y1={y1} x2={x2} y2={y2} markerStart={arrow} markerEnd={arrow} />
      <text x={tx} y={ty} textAnchor="middle" fill="#A65315" stroke="none" fontSize="19">{label}</text>
    </g>
  );
  const circular = kind === "circular";
  return (
    <svg viewBox="0 0 640 320" role="img" aria-label={`Dimension reference for ${kind === "strip" ? "doctor blades" : `${kind} blades and tooling`}`} className="blade-dimension-drawing w-full h-auto">
      <defs><marker id={arrowId} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M 6 0 L 0 3 L 6 6" fill="none" stroke="#A65315" strokeWidth="1.2" /></marker></defs>
      <g fill="#E2E8F0" stroke="#182B49" strokeWidth="2">
        {circular ? <>
          <circle cx="225" cy="150" r="94" /><circle cx="225" cy="150" r="32" fill="#fff" />
          <path d="M115 150H335M225 40V260" strokeDasharray="7 6" strokeWidth="1" />
          <rect x="440" y="56" width="27" height="188" />
        </> : kind === "tooling" ? <>
          <path d="M130 65h58v28h-11v58l-18 27-18-27V93h-11z" />
          <path d="M105 225h34l20 27 20-27h34v55H105z" />
          <path d="M370 120h180v70H370zM370 135h180" />
        </> : <>
          <path d={kind === "toothed" ? `M90 115H510V198${Array.from({ length: 21 }, (_, i) => `L${500-i*20} 180L${490-i*20} 198`).join("")}H90Z` : "M90 115H510V195H90Z"} />
          {kind !== "strip" && [150, 250, 350, 450].map(x => <circle key={x} cx={x} cy="155" r="10" fill="#fff" />)}
          {kind !== "toothed" && <path d="M90 182H510" />}
          <rect x="90" y="250" width="420" height="12" />
        </>}
      </g>
      {circular ? <>
        {dimension(131, 275, 319, 275, "D", 225, 300)}
        {dimension(193, 150, 257, 150, "d", 225, 140)}
        {dimension(440, 275, 467, 275, "T", 454, 300)}
      </> : kind === "tooling" ? <>
        {dimension(139, 213, 179, 213, "V", 159, 203)}
        {dimension(250, 225, 250, 280, "H", 275, 260)}
        {dimension(370, 100, 550, 100, "L", 460, 87)}
        <text x="330" y="246" fontSize="17" fill="#475569">Confirm angle, radii</text><text x="330" y="270" fontSize="17" fill="#475569">and clamping interface</text>
      </> : <>
        {dimension(90, 75, 510, 75, "L", 300, 63)}
        {dimension(555, 115, 555, 195, "W", 580, 160)}
        {dimension(555, 250, 555, 262, "T", 580, 263)}
        {kind !== "strip" && dimension(150, 220, 250, 220, kind === "toothed" ? "Hole pitch" : "P", 200, 243)}
        {kind === "strip" && <text x="300" y="221" textAnchor="middle" fontSize="17" fill="#475569">Specify the working-edge profile</text>}
      </>}
    </svg>
  );
}
