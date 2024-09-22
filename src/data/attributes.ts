export type Attribute = {
  name: AttributeName;
  code: AttributeCode;
};

export type AttributeName =
  | "Strength"
  | "Intelligence"
  | "Willpower"
  | "Agility"
  | "Speed"
  | "Endurance"
  | "Personality"
  | "Luck";

export type AttributeCode =
  | "STR"
  | "INT"
  | "WIL"
  | "AGL"
  | "SPD"
  | "END"
  | "PER"
  | "LCK";

export type AttributesModifier = {
  [key in AttributeCode]?: number;
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

export function getAttributeNameFromCode(
  code: AttributeCode,
): AttributeName | undefined {
  return attributes.find((attribute) => attribute.code === code)?.name;
}

export function getAttributeCodeFromName(
  name: AttributeName,
): AttributeCode | undefined {
  return attributes.find((attribute) => attribute.name === name)?.code;
}

export const attributes: Attribute[] = [
  { name: "Strength", code: "STR" },
  { name: "Intelligence", code: "INT" },
  { name: "Willpower", code: "WIL" },
  { name: "Agility", code: "AGL" },
  { name: "Speed", code: "SPD" },
  { name: "Endurance", code: "END" },
  { name: "Personality", code: "PER" },
  { name: "Luck", code: "LCK" },
];

export default attributes;
