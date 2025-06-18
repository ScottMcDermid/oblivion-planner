import type { SkillsModifier } from '@/utils/skillUtils';

export type AbilityName =
  | 'Skeleton Key'
  | "Gray Prince's Training"
  | "Night Mother's Blessing"
  | 'Vampirism (Stage 1)'
  | 'Vampirism (Stage 2)'
  | 'Vampirism (Stage 3)'
  | 'Vampirism (Stage 4)'
  | 'Dwemer Fireheart'
  | 'Alchemical Brilliance'
  | "Crusader's Arm (Sword)"
  | "Crusader's Arm (Mace)";

export type VampiricStage = 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4';
export const vampiricStages: VampiricStage[] = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'];

export const abilities: Record<AbilityName, SkillsModifier> = {
  'Skeleton Key': { Security: 40 },
  "Gray Prince's Training": { Athletics: 3, Blade: 3, Block: 3 },
  "Night Mother's Blessing": { Acrobatics: 2, Blade: 2, Marksman: 2, Security: 2, Sneak: 2 },
  'Vampirism (Stage 1)': {
    Acrobatics: 5,
    Athletics: 5,
    Destruction: 5,
    'Hand-to-Hand': 5,
    Illusion: 5,
    Mysticism: 5,
    Sneak: 5,
  },
  'Vampirism (Stage 2)': {
    Acrobatics: 10,
    Athletics: 10,
    Destruction: 10,
    'Hand-to-Hand': 10,
    Illusion: 10,
    Mysticism: 10,
    Sneak: 10,
  },
  'Vampirism (Stage 3)': {
    Acrobatics: 15,
    Athletics: 15,
    Destruction: 15,
    'Hand-to-Hand': 15,
    Illusion: 15,
    Mysticism: 15,
    Sneak: 15,
  },
  'Vampirism (Stage 4)': {
    Acrobatics: 20,
    Athletics: 20,
    Destruction: 20,
    'Hand-to-Hand': 20,
    Illusion: 20,
    Mysticism: 20,
    Sneak: 20,
  },
  'Dwemer Fireheart': { Armorer: 15 },
  'Alchemical Brilliance': { Alchemy: 15 },
  "Crusader's Arm (Sword)": { Blade: 10 },
  "Crusader's Arm (Mace)": { Blunt: 10 },
};

export const abilityModifierByVampiricStage: Record<VampiricStage, SkillsModifier> = {
  'Stage 1': abilities['Vampirism (Stage 1)'],
  'Stage 2': abilities['Vampirism (Stage 2)'],
  'Stage 3': abilities['Vampirism (Stage 3)'],
  'Stage 4': abilities['Vampirism (Stage 4)'],
};

export const abilityNameByVampiricStage: Record<VampiricStage, AbilityName> = {
  'Stage 1': 'Vampirism (Stage 1)',
  'Stage 2': 'Vampirism (Stage 2)',
  'Stage 3': 'Vampirism (Stage 3)',
  'Stage 4': 'Vampirism (Stage 4)',
};
