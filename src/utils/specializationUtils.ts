import { Skill } from '@/utils/skillUtils';

export type Specialization = 'Combat' | 'Magic' | 'Stealth';

const specializations: Specialization[] = ['Combat', 'Magic', 'Stealth'];

export const skillsBySpecialization: { [key in Specialization]: Skill[] } = {
  Combat: ['Armorer', 'Athletics', 'Blade', 'Block', 'Blunt', 'Hand-to-Hand', 'Heavy Armor'],
  Magic: [
    'Alchemy',
    'Alteration',
    'Conjuration',
    'Destruction',
    'Illusion',
    'Mysticism',
    'Restoration',
  ],
  Stealth: [
    'Acrobatics',
    'Light Armor',
    'Marksman',
    'Mercantile',
    'Security',
    'Sneak',
    'Speechcraft',
  ],
};

export default specializations;
