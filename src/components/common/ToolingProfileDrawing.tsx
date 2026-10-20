import { useId } from "react";

export type ToolingProfile = "straight-punch" | "gooseneck-punch" | "radius-tool" | "u-forming" | "profile-forming" | "container-forming" | "pole-forming" | "quick-clamp";

/** Open tool sections and separate workpiece examples. No standard dimensions are implied. */
export function ToolingProfileDrawing({ profile, dark = false }: { profile: ToolingProfile; dark?: boolean }) {
  const id = `tooling-arrow-${useId().replace(/:/g, "")}`;
  const ink = dark ? "#cbd5e1" : "#263c52";
  const metal = dark ? "#546c80" : "#dce5ed";
  const accent = dark ? "#91d5e8" : "#16718a";
  const dim = dark ? "#f1c393" : "#a65315";
  const line = (x1: number, y1: number, x2: number, y2: number, label: string, tx: number, ty: number) => <g stroke={dim} strokeWidth="1.5"><path d={`M${x1} ${y1}L${x2} ${y2}`} markerStart={`url(#${id})`} markerEnd={`url(#${id})`} /><text x={tx} y={ty} fill={dim} stroke="none" fontSize="21" textAnchor="middle">{label}</text></g>;
  const lowerV = <path d="M125 325H190L265 400L340 325H405V452H125Z" />;
  const vSheet = <path d="M147 315H186L265 392L344 315H383" />;
  const straight = <path d="M225 50H275V83H297V208L265 270L211 210V83H225Z" />;
  const goose = <path d="M220 45H270V78H295V120L268 143Q225 165 235 195Q239 211 270 235L306 268L267 292L190 217V78H220Z" />;
  const sheetStyle = { fill: "none", stroke: accent, strokeWidth: 5, strokeLinejoin: "round" as const };
  const profileLabel = { "straight-punch": "Straight punch section", "gooseneck-punch": "Gooseneck punch section", "radius-tool": "Radius tool section", "u-forming": "U-forming tool section", "profile-forming": "Matched profile forming section", "container-forming": "Panel forming tool section", "pole-forming": "Pole forming tool section", "quick-clamp": "Upper-tool clamp section" }[profile];
  return <svg viewBox="0 0 900 510" direction="ltr" role="img" aria-label={profileLabel} className="tooling-profile-drawing w-full h-auto">
    <defs><marker id={id} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M7 0L0 3.5L7 7" fill="none" stroke={dim} strokeWidth="1.2" /></marker></defs>
    <path d="M550 45V465" stroke={ink} opacity=".18" strokeDasharray="5 7" />
    <g fill={metal} stroke={ink} strokeWidth="2.5" strokeLinejoin="round">
      {profile === "straight-punch" && <>{straight}{lowerV}</>}
      {profile === "gooseneck-punch" && <>{goose}{lowerV}</>}
      {profile === "radius-tool" && <><path d="M230 45H280V80H310V202H220V80H230Z" /><circle cx="265" cy="231" r="60" /><path d="M95 337H150L265 452L380 337H435V485H95Z" /><path d="M227 190H303" strokeDasharray="4 4" /></>}
      {profile === "u-forming" && <><path d="M235 45H285V85H330V235Q330 257 308 257H222Q200 257 200 235V85H235Z" /><path d="M125 312H175V388Q175 425 212 425H318Q355 425 355 388V312H405V468H125Z" /><path d="M235 440H295V455H235Z" fill={accent} opacity=".4" /></>}
      {profile === "profile-forming" && <><path d="M220 45H280V83H385V165H310L285 193H245L220 165H145V83H220Z" /><path d="M110 325H205L235 355H295L325 325H420V455H110Z" /></>}
      {profile === "container-forming" && <><path d="M220 42H280V72H495V172H460L440 212H400L380 172H340L320 212H280L260 172H220L200 212H160L140 172H95V72H220Z" /><path d="M95 330H140L160 370H200L220 330H260L280 370H320L340 330H380L400 370H440L460 330H495V455H95Z" /></>}
      {profile === "pole-forming" && <><path d="M235 48H285V88H275V230L292 250L265 285L228 250L245 230V88H235Z" />{lowerV}</>}
      {profile === "quick-clamp" && <><path d="M135 55H395V133H135Z" /><path d="M185 133H315V290H185Z" /><path d="M290 155H335V282H290Z" /><path d="M252 245H283V295H300V365L273 410L235 366V295H252Z" /><circle cx="218" cy="175" r="10" /><circle cx="218" cy="245" r="10" /><circle cx="316" cy="192" r="17" /><path d="M316 192L413 143" stroke="#c75b36" strokeWidth="13" strokeLinecap="round" /></>}
    </g>
    <g {...sheetStyle}>
      {["straight-punch", "gooseneck-punch", "pole-forming"].includes(profile) && vSheet}
      {profile === "radius-tool" && <path d="M137 323L191 377A104 104 0 0 0 339 377L393 323" />}
      {profile === "u-forming" && <path d="M184 300V387Q184 416 213 416H317Q346 416 346 387V300" />}
      {profile === "profile-forming" && <path d="M135 316H209L239 346H291L321 316H395" />}
      {profile === "container-forming" && <path d="M108 320H145L165 360H195L215 320H265L285 360H315L335 320H385L405 360H435L455 320H483" />}
    </g>
    <g fill="none" stroke={ink} strokeWidth="1.2" opacity=".55"><path d="M265 18V475" strokeDasharray="7 6" /></g>
    {["straight-punch", "gooseneck-punch"].includes(profile) && <>{line(90, 50, 90, profile === "straight-punch" ? 270 : 292, "H", 65, 175)}{line(190, 477, 340, 477, "V", 265, 500)}<path d={`M${profile === "straight-punch" ? 265 : 267} ${profile === "straight-punch" ? 270 : 292}L400 245`} stroke={dim} fill="none" /><text x="418" y="244" fill={dim} fontSize="21">R</text></>}
    {profile === "gooseneck-punch" && <>{line(236, 184, 329, 184, "C", 287, 168)}<path d="M329 136V235" stroke={dim} strokeDasharray="4 4" /></>}
    {profile === "radius-tool" && <>{line(265, 231, 325, 231, "R", 296, 217)}{line(150, 309, 380, 309, "V", 265, 302)}</>}
    {profile === "u-forming" && <>{line(184, 286, 346, 286, "B", 265, 278)}{line(440, 300, 440, 416, "F", 462, 365)}<path d="M346 392L402 397" stroke={dim} /><text x="412" y="403" fill={dim} fontSize="21">R</text></>}
    {profile === "profile-forming" && <>{line(450, 316, 450, 346, "h", 474, 339)}{line(209, 288, 321, 288, "B", 265, 280)}</>}
    {profile === "container-forming" && <>{line(165, 293, 285, 293, "P", 225, 281)}{line(515, 320, 515, 360, "h", 532, 347)}</>}
    {profile === "pole-forming" && <>{line(190, 477, 340, 477, "V", 265, 500)}<path d="M265 285L430 245" stroke={dim} /><text x="447" y="250" fill={dim} fontSize="21">R</text></>}
    {profile === "quick-clamp" && <>{line(252, 330, 283, 330, "A", 267, 321)}{line(218, 175, 218, 245, "P", 162, 216)}<path d="M218 175H175M218 245H175" stroke={dim} /></>}
    <g {...sheetStyle}>
      {profile === "straight-punch" && <path d="M620 145L710 235L800 145" />}
      {profile === "gooseneck-punch" && <path d="M620 130V245H790V170H750" />}
      {profile === "radius-tool" && <path d="M610 145L643 178A95 95 0 0 0 777 178L810 145" />}
      {profile === "u-forming" && <path d="M630 125V205Q630 235 660 235H760Q790 235 790 205V125" />}
      {profile === "profile-forming" && <path d="M600 200H650L680 230H740L770 200H820" />}
      {profile === "container-forming" && <path d="M585 210H610L630 165H660L680 210H710L730 165H760L780 210H810L830 165H855" />}
      {profile === "pole-forming" && <><path d="M696 252L663 238L646 204V166L670 137H710L744 160L758 197L742 232L717 252" /><path d="M600 359L825 325L846 389L613 410Z" /></>}
    </g>
    {profile === "quick-clamp" ? <g fill={ink} fontSize="21"><text x="600" y="128">Mounting seat</text><text x="600" y="190">Clamping plate</text><text x="600" y="252">Punch tang</text><text x="600" y="314">Locking lever</text><path d="M565 118H590M565 180H590M565 242H590M565 304H590" stroke={dim} strokeWidth="4" /></g> : <>
      <text x="710" y="90" textAnchor="middle" fill={accent} fontSize="21">Workpiece section</text>
      {profile !== "pole-forming" && <><path d="M615 365H810V397H615Z" fill={metal} stroke={ink} strokeWidth="2" />{line(615, 436, 810, 436, "L", 710, 462)}<text x="710" y="328" textAnchor="middle" fill={ink} fontSize="20">Tool length</text></>}
      {profile === "pole-forming" && <>{line(600, 446, 846, 446, "L", 724, 475)}<text x="710" y="305" textAnchor="middle" fill={accent} fontSize="20">Tapered shell</text></>}
    </>}
  </svg>;
}
