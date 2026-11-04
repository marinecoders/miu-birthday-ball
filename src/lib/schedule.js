// The evening's program, shown on the result page and at /schedule/.
// Roughed in from the traditional Marine Corps Birthday Ball ceremony.
// TIMES AND NAMES ARE PLACEHOLDERS: edit them to match your event.
//
// Each entry: time, title, optional detail, and optional steps (for the
// ceremony). Leave `time` empty ("") for anything without a set time.
export const SCHEDULE = [
  {
    time: "1730",
    title: "Reception",
    detail: "Social hour. Photos available near the entrance.",
  },
  {
    time: "1830",
    title: "Guests seated",
    detail: "Please find your table before the ceremony begins.",
  },
  {
    time: "1845",
    title: "Birthday ceremony",
    detail: "Please remain seated unless asked to rise.",
    steps: [
      "Sound Attention and arrival of the official party",
      "Escort of the Guest of Honor",
      "Presentation of the Colors and the National Anthem",
      "Invocation",
      "Remembrance of fallen comrades",
      "Reading of Major General John A. Lejeune's Birthday Message",
      "The Commandant's 251st Birthday Message (video)",
      "Cutting of the birthday cake with the Mameluke sword",
      "First piece of cake to the Guest of Honor",
      "Cake passed from the oldest Marine to the youngest Marine",
      "Remarks by the Guest of Honor",
      "The Marines' Hymn",
      "Retirement of the Colors",
    ],
  },
  {
    time: "1945",
    title: "Dinner",
    detail: "Toasts follow dinner.",
  },
  {
    time: "2100",
    title: "Dancing",
  },
  {
    time: "0000",
    title: "Ball concludes",
    detail: "Thank you for celebrating with us. Semper Fidelis!",
  },
];
