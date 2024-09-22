export type Skill =
  | "Acrobatics"
  | "Agility"
  | "Alchemy"
  | "Alteration"
  | "Armorer"
  | "Athletics"
  | "Blade"
  | "Block"
  | "Blunt"
  | "Conjuration"
  | "Destruction"
  | "Endurance"
  | "Hand-to-Hand"
  | "Heavy Armor"
  | "Illusion"
  | "Intelligence"
  | "Light Armor"
  | "Marksmanship"
  | "Mercantile"
  | "Mysticism"
  | "Personality"
  | "Restoration"
  | "Security"
  | "Sneak"
  | "Speechcraft"
  | "Speed"
  | "Willpower";

export type SkillsModifier = {
  [key in Skill]?: number;
};

export const baseSkills: SkillsModifier = {
  Acrobatics: 0,
  Agility: 0,
  Alchemy: 0,
  Alteration: 0,
  Armorer: 0,
  Athletics: 0,
  Blade: 0,
  Block: 0,
  Blunt: 0,
  Conjuration: 0,
  Destruction: 0,
  Endurance: 0,
  "Hand-to-Hand": 0,
  "Heavy Armor": 0,
  Illusion: 0,
  Intelligence: 0,
  "Light Armor": 0,
  Marksmanship: 0,
  Mercantile: 0,
  Mysticism: 0,
  Personality: 0,
  Restoration: 0,
  Security: 0,
  Sneak: 0,
  Speechcraft: 0,
  Speed: 0,
  Willpower: 0,
};

const skills: Skill[] = [
  "Acrobatics",
  "Agility",
  "Alchemy",
  "Alteration",
  "Armorer",
  "Athletics",
  "Blade",
  "Block",
  "Blunt",
  "Conjuration",
  "Destruction",
  "Endurance",
  "Hand-to-Hand",
  "Heavy Armor",
  "Illusion",
  "Intelligence",
  "Light Armor",
  "Marksmanship",
  "Mercantile",
  "Mysticism",
  "Personality",
  "Restoration",
  "Security",
  "Sneak",
  "Speechcraft",
  "Speed",
  "Willpower",
];

export default skills;
