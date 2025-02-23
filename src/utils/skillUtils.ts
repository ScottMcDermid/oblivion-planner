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

export type SkillShorthand =
  | "ACR"
  | "ALC"
  | "ALT"
  | "ARM"
  | "ATH"
  | "BLD"
  | "BLK"
  | "BLT"
  | "CON"
  | "DES"
  | "H2H"
  | "HAR"
  | "ILL"
  | "LAR"
  | "MRK"
  | "MRC"
  | "MYS"
  | "RST"
  | "SEC"
  | "SNK"
  | "SPE";

export type SkillsModifier = Partial<SkillsSet>;
export const MAX_SKILL_LEVEL = 100;

export type SkillsSet = {
  [key in Skill]: number;
};

export const baseSkills: SkillsSet = {
  Acrobatics: 5,
  Alchemy: 5,
  Alteration: 5,
  Armorer: 5,
  Athletics: 5,
  Blade: 5,
  Block: 5,
  Blunt: 5,
  Conjuration: 5,
  Destruction: 5,
  "Hand-to-Hand": 5,
  "Heavy Armor": 5,
  Illusion: 5,
  "Light Armor": 5,
  Marksmanship: 5,
  Mercantile: 5,
  Mysticism: 5,
  Restoration: 5,
  Security: 5,
  Sneak: 5,
  Speechcraft: 5,
};

export const getSkillsSetTemplate: () => SkillsSet = () => ({
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
});

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

export const shorthandBySkill: { [key in Skill]: SkillShorthand } = {
  Acrobatics: "ACR",
  Alchemy: "ALC",
  Alteration: "ALT",
  Armorer: "ARM",
  Athletics: "ATH",
  Blade: "BLD",
  Block: "BLK",
  Blunt: "BLT",
  Conjuration: "CON",
  Destruction: "DES",
  "Hand-to-Hand": "H2H",
  "Heavy Armor": "HAR",
  Illusion: "ILL",
  "Light Armor": "LAR",
  Marksmanship: "MRK",
  Mercantile: "MRC",
  Mysticism: "MYS",
  Restoration: "RST",
  Security: "SEC",
  Sneak: "SNK",
  Speechcraft: "SPE",
};

export const NUM_MAJOR_SKILLS = 7;

export default skills;
