import type { Attribute } from "@/data/attributes";

const baseAttributes: { [key in Attribute]: number } = {
  Strength: 40,
  Intelligence: 40,
  Willpower: 40,
  Agility: 40,
  Speed: 40,
  Endurance: 40,
  Personality: 40,
  Luck: 50,
};

export default baseAttributes;
