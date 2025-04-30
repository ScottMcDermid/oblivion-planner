import type { Skill } from '@/utils/skillUtils';

export type Attribute =
  | 'Strength'
  | 'Intelligence'
  | 'Willpower'
  | 'Agility'
  | 'Speed'
  | 'Endurance'
  | 'Personality'
  | 'Luck';
export type AttributeShorthand = 'STR' | 'INT' | 'WIL' | 'AGL' | 'SPD' | 'END' | 'PER' | 'LCK';

export type AttributesModifier = Partial<AttributesSet>;

export type AttributesSet = {
  [key in Attribute]: number;
};

export const MAX_ATTRIBUTE_LEVEL = 100;
export const SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS = 10;
export const NUM_VIRTUES_PER_LEVEL = 14;
export const VIRTUES_PER_LUCK = 4;

export const maxBonusByAttribute: AttributesSet = {
  Strength: 5,
  Intelligence: 5,
  Willpower: 5,
  Agility: 5,
  Speed: 5,
  Endurance: 5,
  Personality: 5,
  Luck: 1,
};

export const baseAttributes: AttributesSet = {
  Strength: 40,
  Intelligence: 40,
  Willpower: 40,
  Agility: 40,
  Speed: 40,
  Endurance: 40,
  Personality: 40,
  Luck: 50,
};

export const getAttributesSetTemplate: () => AttributesSet = () => ({
  Strength: 0,
  Intelligence: 0,
  Willpower: 0,
  Agility: 0,
  Speed: 0,
  Endurance: 0,
  Personality: 0,
  Luck: 0,
});

export const skillsByAttribute: { [key in Attribute]: Skill[] } = {
  Strength: ['Blade', 'Blunt', 'Hand-to-Hand'],
  Intelligence: ['Alchemy', 'Conjuration', 'Mysticism'],
  Willpower: ['Alteration', 'Destruction', 'Restoration'],
  Agility: ['Security', 'Sneak', 'Marksmanship'],
  Speed: ['Athletics', 'Acrobatics', 'Light Armor'],
  Endurance: ['Armorer', 'Block', 'Heavy Armor'],
  Personality: ['Mercantile', 'Speechcraft', 'Illusion'],
  Luck: [],
};

export const getAttributeFromSkill = (skill: Skill): Attribute => {
  const attribute = attributes.filter((attribute) =>
    skillsByAttribute[attribute].includes(skill),
  )[0];
  return attribute;
};

export const getRemainingSkillUpsForMaxAttribute = (
  attribute: Attribute,
  level: number,
): number => {
  const remaining = MAX_ATTRIBUTE_LEVEL - level;
  const maxBonus = maxBonusByAttribute[attribute];
  return (remaining / maxBonus) * SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS;
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

const attributes: Attribute[] = [
  'Strength',
  'Intelligence',
  'Willpower',
  'Agility',
  'Speed',
  'Endurance',
  'Personality',
  'Luck',
];

export const shorthandByAttribute: { [key in Attribute]: AttributeShorthand } = {
  Strength: 'STR',
  Intelligence: 'INT',
  Willpower: 'WIL',
  Agility: 'AGL',
  Speed: 'SPD',
  Endurance: 'END',
  Personality: 'PER',
  Luck: 'LCK',
};

export const NUM_FAVORED_ATTRIBUTES = 2;

export default attributes;
