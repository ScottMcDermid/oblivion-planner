import type { AttributesModifier } from "@/utils/attributeUtils";
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
      WIL: 10,
      END: 10,
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
      SPD: 20,
    },
  },
  "The Thief": {
    attributes: {
      AGL: 10,
      LCK: 10,
      SPD: 10,
    },
  },
  "The Tower": {},
  "The Warrior": {
    attributes: {
      END: 10,
      STR: 10,
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
