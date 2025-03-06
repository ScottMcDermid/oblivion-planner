import type { Skill } from '@/utils/skillUtils';

export type Attribute = 'STR' | 'INT' | 'WIL' | 'AGL' | 'SPD' | 'END' | 'PER' | 'LCK';

export type AttributesModifier = Partial<AttributesSet>;

export type AttributesSet = {
  [key in Attribute]: number;
};

export const MAX_ATTRIBUTE_LEVEL = 100;
export const MAX_ATTRIBUTE_BONUS = 5;
export const SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS = 10;

export const baseAttributes: AttributesSet = {
  STR: 40,
  INT: 40,
  WIL: 40,
  AGL: 40,
  SPD: 40,
  END: 40,
  PER: 40,
  LCK: 50,
};

export const getAttributesSetTemplate: () => AttributesSet = () => ({
  STR: 0,
  INT: 0,
  WIL: 0,
  AGL: 0,
  SPD: 0,
  END: 0,
  PER: 0,
  LCK: 0,
});

export const skillsByAttribute: { [key in Attribute]: Skill[] } = {
  STR: ['Blade', 'Blunt', 'Hand-to-Hand'],
  INT: ['Alchemy', 'Conjuration', 'Mysticism'],
  WIL: ['Alteration', 'Destruction', 'Restoration'],
  AGL: ['Security', 'Sneak', 'Marksmanship'],
  SPD: ['Athletics', 'Acrobatics', 'Light Armor'],
  END: ['Armorer', 'Block', 'Heavy Armor'],
  PER: ['Mercantile', 'Speechcraft', 'Illusion'],
  LCK: [],
};

export const getAttributeFromSkill = (skill: Skill): Attribute => {
  const attribute = attributes.filter((attribute) =>
    skillsByAttribute[attribute].includes(skill),
  )[0];
  return attribute;
};

export const getRemainingSkillUpsForMaxAttribute = (level: number): number => {
  const remaining = MAX_ATTRIBUTE_LEVEL - level;
  return (remaining / MAX_ATTRIBUTE_BONUS) * SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS;
};

export function getAttributeBonusFromSkillUps(attributeLevel: number, numSkillUps: number): number {
  const remainingLevels = MAX_ATTRIBUTE_LEVEL - attributeLevel;
  let bonus = 0;
  if (numSkillUps <= 0) bonus = 1;
  else if (numSkillUps <= 4) bonus = 2;
  else if (numSkillUps <= 7) bonus = 3;
  else if (numSkillUps <= 9) bonus = 4;
  else bonus = 5;
  return Math.max(0, Math.min(remainingLevels, bonus));
}

const attributes: Attribute[] = ['STR', 'INT', 'WIL', 'AGL', 'SPD', 'END', 'PER', 'LCK'];

export const NUM_FAVORED_ATTRIBUTES = 2;

export default attributes;
