import { AttributesModifier } from "@/data/attributes";
import { SkillsModifier } from "@/data/skills";

export type Level = {
  attributes: AttributesModifier;
  encumbrance: number;
  health: number;
  level: number;
  magicka: number;
  skills: SkillsModifier;
  stamina: number;
};

// describes the difference in stats between a level
export type LevelUp = {
  attributes: AttributesModifier;
  encumbrance?: number;
  health?: number;
  magicka?: number;
  skills: SkillsModifier;
  stamina?: number;
};
