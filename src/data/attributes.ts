import type { Skill } from "@/data/skills";

export type Attribute =
  | "STR"
  | "INT"
  | "WIL"
  | "AGL"
  | "SPD"
  | "END"
  | "PER"
  | "LCK";

export type AttributesModifier = {
  [key in Attribute]?: number;
};

export const baseAttributes: AttributesModifier = {
  STR: 40,
  INT: 40,
  WIL: 40,
  AGL: 40,
  SPD: 40,
  END: 40,
  PER: 40,
  LCK: 50,
};

export const skillsByAttribute: { [key in Attribute]: Skill[] } = {
  STR: ["Blade", "Blunt", "Hand-to-Hand"],
  INT: ["Alchemy", "Conjuration", "Mysticism"],
  WIL: ["Alteration", "Destruction", "Restoration"],
  AGL: ["Security", "Sneak", "Marksmanship"],
  SPD: ["Athletics", "Acrobatics", "Light Armor"],
  END: ["Armorer", "Block", "Heavy Armor"],
  PER: ["Mercantile", "Speechcraft", "Illusion"],
  LCK: [],
};

const attributes: Attribute[] = [
  "STR",
  "INT",
  "WIL",
  "AGL",
  "SPD",
  "END",
  "PER",
  "LCK",
];

export default attributes;
