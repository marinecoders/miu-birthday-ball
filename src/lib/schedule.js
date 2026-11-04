// The evening's program, shown on the result page and at /schedule/.
// Roughed in from the traditional Marine Corps Birthday Ball ceremony.
// TIMES AND NAMES ARE PLACEHOLDERS: edit them to match your event.
//
// Each entry: time, title, optional detail, and optional steps (for the
// ceremony). Leave `time` empty ("") for anything without a set time.
export const SCHEDULE = [
  {
    time: "1800",
    title: "Cocktail Hour",
    detail: "Social hour. Photos available near the entrance.",
  },
  {
    time: "1855",
    title: "Guests seated",
    detail: "Please find your table before the ceremony begins.",
  },
  {
    time: "1900",
    title: "Birthday Ceremony",
    detail: "Please remain seated unless asked to rise.",
    steps: [
      "Ceremony Commences",
      "Moment of Silence for Fallen Comrades",
      "Chaplain",
      "March on of the Official Party",
      "March on of Colors",
      "National Anthem",
      "Post Colors",
      "Major General Lejeune's Birthday Message",
      "Traditional Cake Cutting Ceremony",
      "Retire the Colors",
      "Anchors Away",
      "The Marines' Hymn",
      "CO's Introduction of the Guest of Honor",
      "Guest of Honor's Comments",
      "Gift Presentation",
    ],
  },
  {
    time: "2000",
    title: "Dinner",
  },
  {
    time: "2100",
    title: "Dancing",
  },
  {
    time: "2300",
    title: "Ball concludes; Departure",
    detail: "Thank you for celebrating with us. Semper Fidelis!",
  },
];
