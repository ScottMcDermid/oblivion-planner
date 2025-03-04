import attributes, {
  Attribute,
  AttributesSet,
  getAttributesSetTemplate,
  baseAttributes,
} from '@/utils/attributeUtils';
import { Birthsign, birthsignModifiers } from '@/utils/birthsignUtils';
import { Gender } from '@/utils/genderUtils';
import { Race, raceModifiers } from '@/utils/raceUtils';
import skills, { baseSkills, getSkillsSetTemplate, Skill, SkillsSet } from '@/utils/skillUtils';
import { skillsBySpecialization, Specialization } from '@/utils/specializationUtils';

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

export const ENCUMBRANCE_MULTIPLIER = 5;
export const BASE_HEALTH_MULTIPLIER = 2;
export const HEALTH_MULTIPLIER = 1 / 10;
export const MAGICKA_MULTIPLIER = 2;
export const FAVORED_ATTRIBUTE_BONUS = 5;
export const SPECIALIZATION_BONUS = 5;
export const MAJOR_SKILL_BONUS = 20;

export const applyLevelUpToLevel = (level: Level, levelUp: LevelUp): Level => {
  const { AGL = 0, END = 0, INT = 0, STR = 0, WIL = 0 } = levelUp.attributes;

  const magicka: number = level.magicka + INT * MAGICKA_MULTIPLIER;
  const stamina: number = level.stamina + END + STR + AGL + WIL;
  const encumbrance: number = level.encumbrance + STR * ENCUMBRANCE_MULTIPLIER;

  const newAttributes: AttributesSet = attributes.reduce(
    (newAttributes, attribute) => ({
      ...newAttributes,
      [attribute]: level.attributes[attribute] + levelUp.attributes[attribute],
    }),
    getAttributesSetTemplate(),
  );

  const health =
    level.health + END * BASE_HEALTH_MULTIPLIER + Math.floor(newAttributes.END * HEALTH_MULTIPLIER);

  const newSkills: SkillsSet = skills.reduce((newSkills, skill) => {
    return {
      ...newSkills,
      [skill]: level.skills[skill] + levelUp.skills[skill],
    };
  }, getSkillsSetTemplate());

  return {
    level: level.level + 1,
    attributes: newAttributes,
    skills: newSkills,
    health,
    magicka,
    stamina,
    encumbrance,
  };
};

export const getBaseLevel = (
  race: Race,
  gender: Gender,
  birthsign: Birthsign,
  specialization: Specialization,
  favoredAttributes: Attribute[],
  majorSkills: Skill[],
): Level => {
  const birthsignAttributeModifiers = birthsignModifiers[birthsign].attributes ?? {};
  const newAttributes: AttributesSet = attributes.reduce((newAttributes, attribute) => {
    const base = baseAttributes[attribute] ?? 0;
    const birthsignModifier = birthsignAttributeModifiers[attribute] ?? 0;
    const favored = favoredAttributes.includes(attribute) ? FAVORED_ATTRIBUTE_BONUS : 0;
    const modifier: number = raceModifiers[race].attributes[gender][attribute] ?? 0;
    return {
      ...newAttributes,
      [attribute]: base + modifier + birthsignModifier + favored,
    };
  }, getAttributesSetTemplate());
  const newSkills: SkillsSet = skills.reduce((newSkills, skill) => {
    const base = baseSkills[skill];
    const modifier: number = raceModifiers[race].skills[skill] ?? 0;
    const specializationBonus = skillsBySpecialization[specialization].includes(skill)
      ? SPECIALIZATION_BONUS
      : 0;
    const majorSkillBonus = majorSkills.includes(skill) ? MAJOR_SKILL_BONUS : 0;
    return {
      ...newSkills,
      [skill]: base + modifier + specializationBonus + majorSkillBonus,
    };
  }, getSkillsSetTemplate());

  const { AGL = 0, END = 0, INT = 0, STR = 0, WIL = 0 } = newAttributes;
  const health = END * BASE_HEALTH_MULTIPLIER;

  // compute magicka
  const birthsignMagickaBonus = birthsignModifiers[birthsign].magicka ?? 0;
  const raceMagickaBonus = raceModifiers[race].magicka ?? 0;
  const baseMagicka = INT * MAGICKA_MULTIPLIER;
  const magicka = baseMagicka + birthsignMagickaBonus + raceMagickaBonus;

  // compute base stamina
  const stamina = END + STR + AGL + WIL;

  // compute base encumbrance
  const encumbrance: number = STR * ENCUMBRANCE_MULTIPLIER;

  return {
    attributes: newAttributes,
    encumbrance,
    health,
    level: 1,
    magicka,
    skills: newSkills,
    stamina,
  };
};
