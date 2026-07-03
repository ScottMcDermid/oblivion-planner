import React from 'react';
import type { IconBaseProps } from 'react-icons';
import type { Skill } from '@/utils/skillUtils';

import {
  GiLeg,
  GiAnvil,
  GiRun,
  GiSpikedMace,
  GiDevilMask,
  GiFist,
  GiBreastplate,
  GiDominoMask,
  GiLeatherArmor,
  GiPadlock,
  GiHood,
  GiChatBubble,
} from 'react-icons/gi';
import { FaVial, FaFeather, FaShieldAlt, FaFireAlt } from 'react-icons/fa';
import { TbArcheryArrow, TbCrystalBall } from 'react-icons/tb';
import { LuSword } from 'react-icons/lu';
import { MdAttachMoney, MdHealthAndSafety } from 'react-icons/md';

const iconBySkill: { [key in Skill]: React.ComponentType<IconBaseProps> } = {
  Acrobatics: GiLeg,
  Alchemy: FaVial,
  Alteration: FaFeather,
  Armorer: GiAnvil,
  Athletics: GiRun,
  Blade: LuSword,
  Block: FaShieldAlt,
  Blunt: GiSpikedMace,
  Conjuration: GiDevilMask,
  Destruction: FaFireAlt,
  'Hand-to-Hand': GiFist,
  'Heavy Armor': GiBreastplate,
  Illusion: GiDominoMask,
  'Light Armor': GiLeatherArmor,
  Marksman: TbArcheryArrow,
  Mercantile: MdAttachMoney,
  Mysticism: TbCrystalBall,
  Restoration: MdHealthAndSafety,
  Security: GiPadlock,
  Sneak: GiHood,
  Speechcraft: GiChatBubble,
};

export default function SkillIcon({ skill, style, ...props }: { skill: Skill } & IconBaseProps) {
  const Icon = iconBySkill[skill];
  return <Icon style={{ verticalAlign: 'middle', flexShrink: 0, ...style }} {...props} />;
}
