export type MomentId =
  | "work"
  | "confidence"
  | "travel"
  | "networking"
  | "everyday"
  | "surprise";

export type Moment = {
  id: MomentId;
  label: string;
  line: string;
  scenario: string;
};

export const moments: Moment[] = [
  {
    id: "work",
    label: "Work",
    line: "You've got an idea. Now convince your manager.",
    scenario:
      "You've just joined a new team and you're explaining an idea to your manager.",
  },
  {
    id: "confidence",
    label: "Confidence",
    line: "You've got something to say. Let's make sure you actually say it.",
    scenario: "You're about to say the thing you usually keep to yourself.",
  },
  {
    id: "travel",
    label: "Travel",
    line: "You've just met someone interesting. Keep the conversation going.",
    scenario: "A long train ride, a stranger with a good story, two hours to go.",
  },
  {
    id: "networking",
    label: "Networking",
    line: "You've got 30 seconds to make a good first impression.",
    scenario: "Someone you admire just asked what you do. Go.",
  },
  {
    id: "everyday",
    label: "Everyday",
    line: "Tell me something you've been obsessed with lately.",
    scenario: "No agenda. Just talk to me like we're waiting for coffee.",
  },
  {
    id: "surprise",
    label: "Surprise me",
    line: "I'll pick something. No overthinking.",
    scenario: "I'm picking. You're talking. That's the deal.",
  },
];

export function getMoment(id: string): Moment | undefined {
  return moments.find((m) => m.id === id);
}

export const soundLikeModes = [
  { id: "natural", label: "More natural" },
  { id: "confident", label: "More confident" },
  { id: "professional", label: "More professional" },
  { id: "persuasive", label: "More persuasive" },
] as const;

export type SessionWord = {
  word: string;
  status: "Used naturally" | "Getting there";
  memory: string;
};

/** Demo data for this session only — WordPlay keeps no long-term memory yet. */
export const sessionWords: SessionWord[] = [
  {
    word: "articulate",
    status: "Used naturally",
    memory: "The word came up while you were explaining your project.",
  },
  {
    word: "nuanced",
    status: "Getting there",
    memory: "You reached for it when your manager pushed back.",
  },
  {
    word: "proactive",
    status: "Used naturally",
    memory: "You used it describing how you'd handle the next sprint.",
  },
];

export const noticedNote =
  "You explain ideas naturally. You tend to rely on general words like 'good' when you could be much more specific.";
