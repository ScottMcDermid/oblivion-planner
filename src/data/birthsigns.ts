import type { AttributesModifier } from "@/data/attributes";
export const birthsignModifiers: {
  [key in Birthsign]: { attributes?: AttributesModifier; magicka?: number };
} = {
  "The Apprentice": {
    magicka: 100,
  },
  "The Atronach": {
    magicka: 150,
  },
  "The Lady": {
    attributes: {
      Willpower: 10,
      Endurance: 10,
    },
  },
  "The Lord": {},
  "The Lover": {},
  "The Mage": {
    magicka: 50,
  },
  "The Ritual": {},
  "The Serpent": {},
  "The Shadow": {},
  "The Steed": {
    attributes: {
      Speed: 20,
    },
  },
  "The Thief": {
    attributes: {
      Agility: 10,
      Luck: 10,
      Speed: 10,
    },
  },
  "The Tower": {},
  "The Warrior": {
    attributes: {
      Endurance: 10,
      Strength: 10,
    },
  },
};

export type Birthsign =
  | "The Apprentice"
  | "The Atronach"
  | "The Lady"
  | "The Lord"
  | "The Lover"
  | "The Mage"
  | "The Ritual"
  | "The Serpent"
  | "The Shadow"
  | "The Steed"
  | "The Thief"
  | "The Tower"
  | "The Warrior";

const birthsigns: Birthsign[] = [
  "The Apprentice",
  "The Atronach",
  "The Lady",
  "The Lord",
  "The Lover",
  "The Mage",
  "The Ritual",
  "The Serpent",
  "The Shadow",
  "The Steed",
  "The Thief",
  "The Tower",
  "The Warrior",
];
export default birthsigns;
