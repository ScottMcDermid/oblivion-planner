export type Skill =
  | "Acrobatics"
  | "Alchemy"
  | "Alteration"
  | "Armorer"
  | "Athletics"
  | "Blade"
  | "Block"
  | "Blunt"
  | "Conjuration"
  | "Destruction"
  | "Hand-to-Hand"
  | "Heavy Armor"
  | "Illusion"
  | "Light Armor"
  | "Marksmanship"
  | "Mercantile"
  | "Mysticism"
  | "Restoration"
  | "Security"
  | "Sneak"
  | "Speechcraft";

export type SkillsModifier = Partial<SkillsSet>;

export type SkillsSet = {
  [key in Skill]: number;
};

export const baseSkills: SkillsSet = {
  Acrobatics: 0,
  Alchemy: 0,
  Alteration: 0,
  Armorer: 0,
  Athletics: 0,
  Blade: 0,
  Block: 0,
  Blunt: 0,
  Conjuration: 0,
  Destruction: 0,
  "Hand-to-Hand": 0,
  "Heavy Armor": 0,
  Illusion: 0,
  "Light Armor": 0,
  Marksmanship: 0,
  Mercantile: 0,
  Mysticism: 0,
  Restoration: 0,
  Security: 0,
  Sneak: 0,
  Speechcraft: 0,
};

export const skillsSetTemplate: SkillsSet = {
  Acrobatics: 0,
  Alchemy: 0,
  Alteration: 0,
  Armorer: 0,
  Athletics: 0,
  Blade: 0,
  Block: 0,
  Blunt: 0,
  Conjuration: 0,
  Destruction: 0,
  "Hand-to-Hand": 0,
  "Heavy Armor": 0,
  Illusion: 0,
  "Light Armor": 0,
  Marksmanship: 0,
  Mercantile: 0,
  Mysticism: 0,
  Restoration: 0,
  Security: 0,
  Sneak: 0,
  Speechcraft: 0,
};

const skills: Skill[] = [
  "Acrobatics",
  "Alchemy",
  "Alteration",
  "Armorer",
  "Athletics",
  "Blade",
  "Block",
  "Blunt",
  "Conjuration",
  "Destruction",
  "Hand-to-Hand",
  "Heavy Armor",
  "Illusion",
  "Light Armor",
  "Marksmanship",
  "Mercantile",
  "Mysticism",
  "Restoration",
  "Security",
  "Sneak",
  "Speechcraft",
];

export default skills;
