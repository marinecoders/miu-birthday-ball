// Both printed QR fragments (#k=...&d=N) and plain ?d=N links are supported.
// A new scan replaces the remembered entry; invalid links clear stale entries.
const STORAGE_KEY = "guestDoor";
const valid = value => /^[1-6]$/.test(value ?? "");

export function getDoor() {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const fromLink = hash.has("d") ? hash.get("d") : query.get("d");
    try {
        if (fromLink !== null) {
            if (valid(fromLink)) localStorage.setItem(STORAGE_KEY, fromLink);
            else localStorage.removeItem(STORAGE_KEY);
        }
        const door = fromLink ?? localStorage.getItem(STORAGE_KEY);
        return valid(door) ? door : null;
    } catch {
        return valid(fromLink) ? fromLink : null;
    }
}
