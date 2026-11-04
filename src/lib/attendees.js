// Loads the guest list once and shares it between components.
//
// public/attendees.enc.json is the list encrypted with AES-256-GCM by
// guest-list/build_guest_list.py. The key comes from the QR code link
// (https://site/#k=KEY). The part after # never leaves the phone, so the
// key isn't sent to the web host. It's remembered on the phone so the guest
// can move between pages and come back later.
import { url } from "./url.js";

const ATTENDEES_URL = url("attendees.enc.json");
const STORAGE_KEY = "guestListKey";
const DOOR_STORAGE_KEY = "guestDoor";

let cache;

function storage(action, value, name = STORAGE_KEY) {
  try {
    if (action === "get") return localStorage.getItem(name);
    if (action === "set") localStorage.setItem(name, value);
    if (action === "remove") localStorage.removeItem(name);
  } catch {
    // Storage blocked (private browsing etc.); the key just isn't remembered.
  }
  return null;
}

function fromBase64Url(text) {
  const base64 = text.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(text.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

// The key from the link, else the one remembered from an earlier visit.
export function getKey() {
  const fromLink = new URLSearchParams(window.location.hash.slice(1)).get("k");
  if (fromLink) {
    storage("set", fromLink);
    return fromLink;
  }
  return storage("get");
}

// The door the guest scanned in at (each door's QR code adds &d=N), else the
// one remembered from an earlier scan. Null if unknown.
export function getDoor() {
  const fromLink = new URLSearchParams(window.location.hash.slice(1)).get("d");
  if (fromLink) {
    storage("set", fromLink, DOOR_STORAGE_KEY);
    return fromLink;
  }
  return storage("get", null, DOOR_STORAGE_KEY);
}

// Adds the key (and door) to a link between pages, so the next page works
// even if the phone didn't save them (some QR scanner apps open links in a
// built-in browser that doesn't keep them).
export function withKey(href) {
  const key = getKey();
  if (!key) return href;
  const door = getDoor();
  return `${href}#k=${key}${door ? `&d=${encodeURIComponent(door)}` : ""}`;
}

async function decrypt(file, key) {
  const cryptoKey = await crypto.subtle.importKey("raw", fromBase64Url(key), "AES-GCM", false, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromBase64Url(file.iv) },
    cryptoKey,
    fromBase64Url(file.data)
  );
  return JSON.parse(new TextDecoder().decode(plaintext));
}

export function loadAttendees() {
  cache ??= (async () => {
    const key = getKey();
    if (!key) throw new Error("No guest list key. Scan a QR code.");
    const response = await fetch(ATTENDEES_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Guest list failed to load (${response.status})`);
    const file = await response.json();
    let attendees;
    try {
      attendees = await decrypt(file, key);
    } catch {
      storage("remove"); // wrong or outdated key; make them scan again
      throw new Error("This QR code doesn't match the current guest list.");
    }
    const byTable = {};
    for (const attendee of attendees) {
      (byTable[attendee.table] ??= []).push(attendee);
    }
    const uniqueTableNumbers = Object.keys(byTable).sort((a, b) => a - b);
    return { attendees, byTable, uniqueTableNumbers };
  })();
  return cache;
}

export function fullName(attendee) {
  return [attendee.title, attendee.first_name, attendee.last_name].filter(Boolean).join(" ");
}
