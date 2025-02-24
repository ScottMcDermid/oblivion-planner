import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';
import type { Attribute } from '@/utils/attributeUtils';
import type { Skill } from '@/utils/skillUtils';
import { levelTemplate, type Level, type LevelUp } from '@/utils/levelUtils';

import races from '@/utils/raceUtils';
import genders from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import specializations from '@/utils/specializationUtils';
import attributes, { NUM_FAVORED_ATTRIBUTES } from '@/utils/attributeUtils';
import skills, { NUM_MAJOR_SKILLS } from '@/utils/skillUtils';

type State = {
  race: Race;
  gender: Gender;
  birthsign: Birthsign;
  specialization: Specialization;
  favoredAttributes: Attribute[];
  majorSkills: Skill[];
  currentLevel: Level;
  levels: Level[];
  levelUps: LevelUp[];
};

type Action = {
  setCharacterData: (state: Partial<State>) => void;
  setLevels: (levels: Level[]) => void;
  setLevelUp: (levelUp: LevelUp, level?: number) => void;
  removeLevel: (level: number) => void;
};

type CharacterStore = State & { actions: Action };

const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => {
      return {
        race: races[0],
        gender: genders[0],
        birthsign: birthsigns[0],
        specialization: specializations[0],
        favoredAttributes: attributes.slice(0, NUM_FAVORED_ATTRIBUTES),
        majorSkills: skills.slice(0, NUM_MAJOR_SKILLS),
        currentLevel: levelTemplate,
        levels: [],
        levelUps: [],
        actions: {
          setCharacterData: (state: Partial<State>) => set(() => ({ ...state })),
          setLevels: (levels) =>
            set(() => ({
              currentLevel: levels.length > 0 ? levels[levels.length - 1] : levelTemplate,
              levels,
            })),
          setLevelUp: (levelUp, level) => {
            set((state) => {
              const levelIndex = level === undefined ? state.levelUps.length : level - 2;
              const newLevelUps = state.levelUps.slice(0);
              newLevelUps[levelIndex] = levelUp;
              return { levelUps: newLevelUps };
            });
          },
          removeLevel: (level) =>
            set((state) => {
              const newLevelUps = state.levelUps.slice(0);
              newLevelUps.splice(level - 2, 1);
              return { levelUps: newLevelUps };
            }),
        },
      };
    },
    {
      name: 'oblivion-planner',
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        race: state.race,
        gender: state.gender,
        birthsign: state.birthsign,
        specialization: state.specialization,
        favoredAttributes: state.favoredAttributes,
        majorSkills: state.majorSkills,
        currentLevel: state.currentLevel,
        levels: state.levels,
        levelUps: state.levelUps,
      }),
    },
  ),
);

export { useCharacterStore };
