// Typo-tolerant guest name search.
//
// Every word the guest types must match some part of a name (title, first,
// or last name), in any order. A word matches if it is:
//   - the start of a name part ("smi" -> Smith), best
//   - a common nickname ("bob" -> Robert)
//   - inside a name part ("ill" -> O'Neill, 3+ letters)
//   - a near miss: 1 typo for 4-5 letters, 2 typos for 6+ ("jonh" -> John,
//     "mcalister" -> McAllister). A swap of two letters counts as one typo.
// Results are ranked best match first.

// Common nicknames -> formal names. Add your own as needed.
const NICKNAMES = {
  abby: ["abigail"], alex: ["alexander", "alexandra", "alexis"], andy: ["andrew"],
  ben: ["benjamin"], beth: ["elizabeth"], bill: ["william"], billy: ["william"],
  bob: ["robert"], bobby: ["robert"], cathy: ["catherine", "kathryn"], chris: ["christopher", "christina", "christine"],
  dan: ["daniel"], danny: ["daniel"], dave: ["david"], deb: ["deborah"], ed: ["edward"],
  jake: ["jacob"], jim: ["james"], jimmy: ["james"], joe: ["joseph"], jon: ["jonathan", "john"],
  josh: ["joshua"], kate: ["katherine", "kathryn", "catherine"], katie: ["katherine", "kathryn"],
  kim: ["kimberly"], liz: ["elizabeth"], matt: ["matthew"], meg: ["megan", "margaret"],
  mike: ["michael"], nate: ["nathan", "nathaniel"], nick: ["nicholas"], pat: ["patrick", "patricia"],
  rob: ["robert"], sam: ["samuel", "samantha"], steve: ["steven", "stephen"], sue: ["susan"],
  ted: ["edward", "theodore"], tom: ["thomas"], tony: ["anthony"], will: ["william"], zach: ["zachary"],
};

export function normalize(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents: José -> jose
    .toLowerCase()
    .replace(/['’.]/g, "") // O'Neill -> oneill, Mr. -> mr
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Name parts to match against, e.g. "Mrs. Mary-Kate O'Neill" ->
// ["mrs", "mary", "kate", "marykate", "oneill"].
function nameParts(name) {
  const parts = normalize(name).split(" ").filter(Boolean);
  const joined = String(name)
    .split(/\s+/)
    .filter((p) => p.includes("-"))
    .map((p) => normalize(p).replace(/ /g, ""));
  return [...parts, ...joined];
}

// Optimal string alignment distance: insert, delete, replace, or swap two
// neighboring letters each cost 1. Stops early once it passes `max`.
function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2 = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d = Math.min(d, prev2[j - 2] + 1);
      }
      cur.push(d);
      rowMin = Math.min(rowMin, d);
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

function typosAllowed(word) {
  if (word.length <= 3) return 0;
  if (word.length <= 5) return 1;
  return 2;
}

// Lower is better; Infinity means no match.
function wordScore(word, parts) {
  let best = Infinity;
  const nicknames = NICKNAMES[word] || [];
  const allowed = typosAllowed(word);
  for (const part of parts) {
    if (part.startsWith(word)) return 0;
    if (nicknames.includes(part)) best = Math.min(best, 0.5);
    else if (word.length >= 3 && part.includes(word)) best = Math.min(best, 1);
    else if (allowed > 0) {
      // Compare with the whole part, and with its start in case they're still
      // typing (one letter longer too, for a dropped letter: "abot" -> "abbot").
      const d = Math.min(
        editDistance(word, part, allowed),
        editDistance(word, part.slice(0, word.length), allowed),
        editDistance(word, part.slice(0, word.length + 1), allowed)
      );
      if (d <= allowed) best = Math.min(best, 2 + d);
    }
  }
  return best;
}

const partsCache = new Map();

// Filter for react-select-search's `filterOptions`: (options, query) -> options.
export function searchGuests(options, query) {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return options;
  const scored = [];
  for (const option of options) {
    let parts = partsCache.get(option.name);
    if (!parts) partsCache.set(option.name, (parts = nameParts(option.name)));
    let total = 0;
    for (const word of words) {
      const s = wordScore(word, parts);
      if (s === Infinity) {
        total = Infinity;
        break;
      }
      total += s;
    }
    if (total !== Infinity) scored.push([total, option]);
  }
  scored.sort((a, b) => a[0] - b[0]); // stable: keeps alphabetical order within ties
  return scored.map(([, option]) => option);
}
