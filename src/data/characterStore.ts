import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';
import type { Attribute } from '@/utils/attributeUtils';
import type { Skill } from '@/utils/skillUtils';
import { levelTemplate, levelUpTemplate, type Level, type LevelUp } from '@/utils/levelUtils';

import races from '@/utils/raceUtils';
import genders from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import specializations from '@/utils/specializationUtils';
import attributes, { NUM_FAVORED_ATTRIBUTES, shorthandByAttribute } from '@/utils/attributeUtils';
import skills, { NUM_MAJOR_SKILLS } from '@/utils/skillUtils';

type State = {
  remastered: boolean;
  isFirstVisit: boolean;
  race: Race;
  gender: Gender;
  birthsign: Birthsign;
  specialization: Specialization;
  favoredAttributes: Attribute[];
  majorSkills: Skill[];
  currentLevel: Level;
  currentLevelUp: LevelUp;
  levels: Level[];
  levelUps: LevelUp[];
  version: number;
};

type Action = {
  setCharacterData: (state: Partial<State>) => void;
  setLevels: (levels: Level[]) => void;
  setLevelUp: (levelUp: LevelUp, level?: number) => void;
  removeLevel: (level: number) => void;
  resetLevels: () => void;
};

type CharacterStore = State & { actions: Action };

const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => {
      return {
        remastered: false,
        isFirstVisit: true,
        race: races[0],
        gender: genders[0],
        birthsign: birthsigns[0],
        specialization: specializations[0],
        favoredAttributes: attributes.slice(0, NUM_FAVORED_ATTRIBUTES),
        majorSkills: skills.slice(0, NUM_MAJOR_SKILLS),
        currentLevel: levelTemplate,
        currentLevelUp: levelUpTemplate,
        setCurrentLevelUp: levelUpTemplate,
        levels: [],
        levelUps: [],
        version: 1,
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
          resetLevels: () =>
            set(() => ({
              currentLevel: levelTemplate,
              currentLevelUp: levelUpTemplate,
              levels: [],
              levelUps: [],
            })),
        },
      };
    },
    {
      name: 'oblivion-planner',
      version: 1,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        remastered: state.remastered,
        isFirstVisit: state.isFirstVisit,
        race: state.race,
        gender: state.gender,
        birthsign: state.birthsign,
        specialization: state.specialization,
        favoredAttributes: state.favoredAttributes,
        majorSkills: state.majorSkills,
        currentLevel: state.currentLevel,
        currentLevelUp: state.currentLevelUp,
        levels: state.levels,
        levelUps: state.levelUps,
        version: state.version,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<State>;
        if (!version) {
          console.log('Migrating from version 0 to 1...', state.favoredAttributes);

          if (state.favoredAttributes) {
            // invert shorthand/fullname attributes
            const fullNameByShorthandAttribute = Object.fromEntries(
              Object.entries(shorthandByAttribute).map(([key, value]) => [value, key]),
            );

            // migrate shorthand attributes to fullname format
            const migratedFavoredAttributesWithDuplicates = state.favoredAttributes.map(
              (attribute: string) => fullNameByShorthandAttribute[attribute] ?? attribute,
            );

            // remove duplicates
            const migratedFavoredAttributes = migratedFavoredAttributesWithDuplicates.filter(
              (value, index, self) => self.indexOf(value) === index,
            );

            console.log('Finished migrating!', migratedFavoredAttributes);
            return {
              ...state,
              favoredAttributes: migratedFavoredAttributes,
            };
          }
        }
        return persistedState;
      },
    },
  ),
);

export { useCharacterStore };
