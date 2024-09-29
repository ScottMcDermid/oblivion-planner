import { AttributesSet, getAttributesSetTemplate } from "@/data/attributes";
import { SkillsSet, getSkillsSetTemplate } from "@/data/skills";

export type Level = {
  attributes: AttributesSet;
  encumbrance: number;
  health: number;
  level: number;
  magicka: number;
  skills: SkillsSet;
  stamina: number;
};

// describes the difference in stats between a level
export type LevelUp = {
  attributes: AttributesSet;
  skills: SkillsSet;
};

export const levelTemplate: Level = {
  attributes: getAttributesSetTemplate(),
  encumbrance: 0,
  health: 0,
  level: 0,
  magicka: 0,
  skills: getSkillsSetTemplate(),
  stamina: 0,
};

export const levelUpTemplate: LevelUp = {
  attributes: getAttributesSetTemplate(),
  skills: getSkillsSetTemplate(),
};
