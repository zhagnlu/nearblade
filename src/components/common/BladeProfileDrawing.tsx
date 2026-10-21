import { useId } from "react";

export type BladeProfile = "shear" | "metal-slitter" | "converting-slitter" | "bar-shear" | "billet-shear" | "corrugated-thin" | "slotting-arc" | "serrated" | "doctor-strip" | "doctor-holder" | "chipper" | "granulator-rotor" | "granulator-bed";

/** Illustrative component sections, not machine settings or manufacturing drawings. */
export function BladeProfileDrawing({ profile, dark = false }: { profile: BladeProfile; dark?: boolean }) {
  const id = `blade-arrow-${useId().replace(/:/g, "")}`;
  const ink = dark ? "#cbd5e1" : "#263c52";
  const metal = dark ? "#546c80" : "#dce5ed";
  const edge = dark ? "#91d5e8" : "#16718a";
  const dim = dark ? "#f1c393" : "#a65315";
  const d = (x1: number, y1: number, x2: number, y2: number, letter: string, tx: number, ty: number) => <g stroke={dim} strokeWidth="1.5"><path d={`M${x1} ${y1}L${x2} ${y2}`} markerStart={`url(#${id})`} markerEnd={`url(#${id})`} /><text x={tx} y={ty} textAnchor="middle" fill={dim} stroke="none" fontSize="21">{letter}</text></g>;
  const circular = ["metal-slitter", "converting-slitter", "corrugated-thin"].includes(profile);
  const bar = profile === "bar-shear";
  const billet = profile === "billet-shear";
  const granulator = profile.startsWith("granulator-");
  const top = profile === "granulator-rotor" ? 125 : profile === "doctor-holder" ? 115 : profile === "doctor-strip" ? 160 : profile === "granulator-bed" ? 155 : 145;
  const bottom = profile === "chipper" ? 256 : profile === "granulator-rotor" ? 265 : profile === "serrated" ? 274 : profile === "doctor-strip" ? 220 : profile === "doctor-holder" ? 258 : profile === "shear" ? 242 : 245;
  const teeth = Array.from({ length: 14 }, (_, i) => `L${110 + i * 28} 249L${124 + i * 28} 274`).join("");
  return <svg viewBox="0 0 900 510" direction="ltr" role="img" aria-label="Dimensions & Fit" className="blade-profile-drawing w-full h-auto">
    <defs><marker id={id} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M7 0L0 3.5L7 7" fill="none" stroke={dim} strokeWidth="1.2" /></marker></defs>
    <path d="M550 40V470" stroke={ink} opacity=".18" strokeDasharray="5 7" />
    <g fill={metal} stroke={ink} strokeWidth="2.5" strokeLinejoin="round">
      {circular && <><circle cx="280" cy="228" r="158" /><circle cx="280" cy="228" r={profile === "corrugated-thin" ? 38 : 62} fill={dark ? "#263b4f" : "#fff"} />
        {profile === "converting-slitter" && <circle cx="280" cy="228" r="132" fill="none" stroke={edge} />}
        {profile === "corrugated-thin" && <circle cx="280" cy="228" r="148" fill="none" stroke={edge} />}
        {profile === "metal-slitter" && <><path d="M680 110H726V345H680Z" /><path d="M635 150H665V325H635Z" fill="none" strokeDasharray="5 5" /></>}
        {profile === "converting-slitter" && <path d="M675 110H715V300L675 340Z" />}
        {profile === "corrugated-thin" && <path d="M694 100H706V318L700 345L694 318Z" />}
      </>}
      {profile === "shear" && <><path d="M100 145H510V242H100Z" /><path d="M100 229H510" stroke={edge} /><path d="M645 120H742V160L661 160L645 148ZM645 250H742V290H645Z" /><path d="M615 206H790" stroke={edge} strokeWidth="4" /></>}
      {(bar || billet) && <><path d={bar ? "M130 85H440V198H332A47 47 0 0 0 238 198H130Z" : "M130 85H440V198H333L285 150L237 198H130Z"} /><path d={bar ? "M130 288H238A47 47 0 0 0 332 288H440V410H130Z" : "M130 288H237L285 336L333 288H440V410H130Z"} />
        {bar ? <circle cx="285" cy="243" r="40" fill="none" stroke={edge} strokeWidth="4" /> : <path d="M285 198L330 243L285 288L240 243Z" fill="none" stroke={edge} strokeWidth="4" />}
        <path d="M635 115H745V165H635Z" /><path d="M635 265H745V315H635Z" /><path d="M600 215H805" stroke={edge} strokeWidth="4" />
      </>}
      {profile === "slotting-arc" && <><path d="M90 250A245 245 0 0 1 510 250L474 271A203 203 0 0 0 126 271Z" />
        <path d="M164 217L197 191M274 165H322M398 192L431 218" fill="none" strokeWidth="11" strokeLinecap="round" />
        <path d="M690 145H710V360H690Z" /><path d="M690 348H710" stroke={edge} />
      </>}
      {profile === "serrated" && <><path d={`M110 145H502V274${teeth.split(/(?=L)/).reverse().join("")}Z`} /><path d="M650 170H754L738 205H650Z" /><path d="M650 300H754" stroke={edge} strokeWidth="4" /></>}
      {profile === "doctor-strip" && <><path d="M100 160H510V220H100Z" /><path d="M100 212H510" stroke={edge} /><path d="M625 145H740V170H778V182H625Z" /><path d="M625 270H740L778 295H625Z" /><path d="M625 380H756Q792 392 756 404H625Z" /></>}
      {profile === "doctor-holder" && <><path d="M110 115H510V245H110Z" /><path d="M110 215H510" /><path d="M135 245H485V258H135Z" fill={edge} /><path d="M640 120H735V210H640Z" /><path d="M640 230H735V270H640Z" /><path d="M665 212H780V225H665Z" fill={edge} /><circle cx="686" cy="155" r="13" fill="none" /></>}
      {profile === "chipper" && <><path d="M100 145H510V256H100Z" /><path d="M100 225H510" stroke={edge} /><path d="M630 150H775V190H720L630 150Z" /><path d="M625 240H775V290H625Z" opacity=".5" /><path d="M620 318H780L760 350H640Z" fill="none" /><path d="M720 191L750 225" fill="none" stroke={dim} /></>}
      {granulator && <><path d={profile === "granulator-rotor" ? "M120 125H500V230L450 265H120Z" : "M120 155H500V245H120Z"} /><path d={profile === "granulator-rotor" ? "M120 243H480" : "M120 232H500"} stroke={edge} />
        <circle cx="705" cy="235" r="105" fill="none" strokeDasharray="6 6" opacity=".7" />
        <path d="M750 128L781 148L733 219L709 204Z" fill={profile === "granulator-rotor" ? edge : metal} />
        <path d="M752 237H820V280H780Z" fill={profile === "granulator-bed" ? edge : metal} />
        <path d="M765 219L780 237" stroke={dim} strokeWidth="2" />
      </>}
    </g>
    {(bar || billet) && <g fill="none" stroke={edge} strokeWidth="3">
      <path d={bar ? "M130 198H238A47 47 0 0 1 332 198H440" : "M130 198H237L285 150L333 198H440"} />
      <path d={bar ? "M130 288H238A47 47 0 0 0 332 288H440" : "M130 288H237L285 336L333 288H440"} />
      <text x="700" y="80" fill={edge} stroke="none" fontSize="21" textAnchor="middle">Edge and knife set</text>
    </g>}
    {circular ? <>{d(122, 420, 438, 420, "D", 280, 447)}{d(280 - (profile === "corrugated-thin" ? 38 : 62), 228, 280 + (profile === "corrugated-thin" ? 38 : 62), 228, "d", 280, 214)}{d(profile === "corrugated-thin" ? 694 : profile === "metal-slitter" ? 680 : 675, 385, profile === "corrugated-thin" ? 706 : profile === "metal-slitter" ? 726 : 715, 385, "T", 704, 414)}<text x="700" y="75" textAnchor="middle" fill={edge} fontSize="21">Edge geometry</text></> : <>
      {!bar && !billet && profile !== "slotting-arc" && <>{d(profile === "shear" || profile === "chipper" || profile === "doctor-strip" ? 100 : profile === "granulator-rotor" || profile === "granulator-bed" ? 120 : 110, 325, granulator ? 500 : profile === "serrated" ? 502 : 510, 325, "L", 310, 351)}{d(72, top, 72, bottom, "W", 48, 201)}</>}
      {(bar || billet) && <>{d(130, 453, 440, 453, "L", 285, 481)}{bar ? d(285, 198, 332, 198, "R", 309, 183) : d(240, 243, 330, 243, "B", 285, 231)}</>}
      {profile === "slotting-arc" && <>{d(90, 425, 510, 425, "L", 300, 453)}<path d="M300 376L300 132M290 376H310M300 366V386" stroke={dim} /><text x="317" y="305" fill={dim} fontSize="21">R</text>{d(690, 405, 710, 405, "T", 700, 435)}<text x="700" y="100" textAnchor="middle" fill={edge} fontSize="21">Cutting edge</text></>}
      {profile === "serrated" && <>{d(222, 293, 250, 293, "P", 235, 318)}<text x="700" y="120" textAnchor="middle" fill={edge} fontSize="21">Cutting edge</text></>}
      {profile === "doctor-strip" && <><text x="700" y="115" textAnchor="middle" fill={edge} fontSize="21">Metering edge</text>{d(808, 145, 808, 182, "T", 837, 171)}</>}
      {profile === "doctor-holder" && <><text x="700" y="85" textAnchor="middle" fill={edge} fontSize="21">Mounting details</text><path d="M782 220L810 350" stroke={dim} /><text x="700" y="389" textAnchor="middle" fill={edge} fontSize="21">Metering edge</text></>}
      {granulator && <><text x="700" y="85" textAnchor="middle" fill={edge} fontSize="21">{profile === "granulator-rotor" ? "Granulator Rotor Knives" : "Granulator Bed Knives"}</text><text x="700" y="406" textAnchor="middle" fill={dim} fontSize="21">{profile === "granulator-rotor" ? "Granulator Bed Knives" : "Granulator Rotor Knives"}</text></>}
      {profile === "chipper" && <text x="700" y="105" textAnchor="middle" fill={edge} fontSize="21">Cutting edge</text>}
      {profile === "shear" && <text x="700" y="85" textAnchor="middle" fill={edge} fontSize="21">Edge and knife set</text>}
    </>}
  </svg>;
}
