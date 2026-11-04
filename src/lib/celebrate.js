// The celebration on the result page: a few staggered bursts of paper
// confetti and Marine Corps icons that flutter, drift, and fall slowly.
import confetti from "canvas-confetti";
import { EGA_PATH } from "./ega-path.js";

const SCARLET = "#BA0C2F";
const GOLD = "#FFC72C";
const COLORS = [SCARLET, GOLD, "#ffffff", "#E9C46A"];

// Special guests get their own icons (lowercase name -> emoji list).
const SPECIAL = {
  "erik rye": ["🐝"],
  "laura smith": ["🇬🇧"],
};

const ICONS = ["🇺🇸", "🦅", "⚓", "⭐", "🐝", "🖍️"];

export function celebrate(guestName = "") {
  const name = guestName.toLowerCase();
  const special = Object.keys(SPECIAL).find((n) => name.includes(n));
  const iconScalar = 2.2;
  const icons = (special ? SPECIAL[special] : ICONS).map((text) =>
    confetti.shapeFromText({ text, scalar: iconScalar })
  );
  const ega = confetti.shapeFromPath({ path: EGA_PATH });

  // Settings shared by every piece: slower fall, a little wind, long hang time.
  const base = {
    disableForReducedMotion: true,
    gravity: 0.7,
    decay: 0.93,
    ticks: 320,
    zIndex: 60,
  };

  // Paper: flat: false lets each piece tilt and wobble like real confetti.
  const paper = (opts) =>
    confetti({ ...base, colors: COLORS, shapes: ["square", "circle"], scalar: 1.1, ...opts });

  // Icons: kept flat (wobble squashes emoji), with random drift instead.
  const iconBurst = (opts) =>
    confetti({
      ...base,
      flat: true,
      shapes: icons,
      scalar: iconScalar,
      drift: Math.random() - 0.5,
      ...opts,
    });

  const egaBurst = (opts) =>
    confetti({ ...base, shapes: [ega], colors: [GOLD], scalar: 3, flat: true, ...opts });

  // A layered pop from the bottom center, the "realistic" pattern: several
  // bursts with different spreads and speeds look less like a single cannon.
  const pop = (origin) => {
    paper({ origin, particleCount: 50, spread: 26, startVelocity: 55 });
    paper({ origin, particleCount: 40, spread: 60 });
    paper({ origin, particleCount: 70, spread: 100, decay: 0.91, scalar: 0.8 });
    paper({ origin, particleCount: 20, spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.3 });
  };

  pop({ x: 0.5, y: 0.9 });

  // Side cannons with icons.
  setTimeout(() => {
    iconBurst({ angle: 60, spread: 55, particleCount: 12, origin: { x: 0, y: 0.75 }, startVelocity: 50 });
    iconBurst({ angle: 120, spread: 55, particleCount: 12, origin: { x: 1, y: 0.75 }, startVelocity: 50 });
    if (!special) {
      egaBurst({ angle: 60, spread: 45, particleCount: 4, origin: { x: 0, y: 0.8 }, startVelocity: 45 });
      egaBurst({ angle: 120, spread: 45, particleCount: 4, origin: { x: 1, y: 0.8 }, startVelocity: 45 });
    }
  }, 250);

  // A gentle shower from the top so pieces keep floating down for a moment.
  setTimeout(() => {
    paper({ particleCount: 60, spread: 160, startVelocity: 12, origin: { x: 0.5, y: -0.1 }, gravity: 0.45, drift: 0.4 });
    iconBurst({ particleCount: 8, spread: 160, startVelocity: 10, origin: { x: 0.5, y: -0.1 }, gravity: 0.4 });
  }, 700);
}
