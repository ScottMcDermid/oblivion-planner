import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';
import type { Attribute } from '@/utils/attributeUtils';
import type { Skill, SkillsSet } from '@/utils/skillUtils';
import type { AbilityName } from '@/utils/abilityUtils';
import { levelTemplate, levelUpTemplate, type Level, type LevelUp } from '@/utils/levelUtils';

import races from '@/utils/raceUtils';
import genders from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import specializations from '@/utils/specializationUtils';
import attributes, { NUM_FAVORED_ATTRIBUTES, shorthandByAttribute } from '@/utils/attributeUtils';
import skills, { getSkillsSetTemplate, NUM_MAJOR_SKILLS } from '@/utils/skillUtils';

type State = {
  remastered: boolean;
  activeAbilities: AbilityName[];
  abilityModifiers: SkillsSet;
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
        activeAbilities: [],
        abilityModifiers: getSkillsSetTemplate(),
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
        version: 2,
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
              abilityModifiers: getSkillsSetTemplate(),
              activeAbilities: [],
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
      version: 2,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        remastered: state.remastered,
        activeAbilities: state.activeAbilities,
        abilityModifiers: state.abilityModifiers,
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
        if (version < 2) {
          console.log('Migrating from version 1 to 2...');

          const newState = { ...state };

          // rename marksmanship -> marksman
          if (state.levels) {
            newState.levels = state.levels.map((level) => {
              // @ts-expect-error: Migrating from old state types
              console.log(`updating level.skills.Marksman to ${level.skills.Marksmanship}`);
              // @ts-expect-error: Migrating from old state types
              level.skills.Marksman = level.skills.Marksmanship;
              // @ts-expect-error: Migrating from old state types
              delete level.skills.Marksmanship;

              return level;
            });
          }

          if (state.levelUps) {
            newState.levelUps = state.levelUps.map((levelUp) => {
              // @ts-expect-error: Migrating from old state types
              console.log(`updating levelUp.skills.Marksman to ${levelUp.skills.Marksmanship}`);
              // @ts-expect-error: Migrating from old state types
              levelUp.skills.Marksman = levelUp.skills.Marksmanship;
              // @ts-expect-error: Migrating from old state types
              delete levelUp.skills.Marksmanship;

              return levelUp;
            });
          }
          if (state.currentLevel) {
            // @ts-expect-error: Migrating from old state types
            newState.currentLevel.skills.Marksman = state.currentLevel.Marksmanship;
          }
          if (state.currentLevelUp) {
            // @ts-expect-error: Migrating from old state types
            newState.currentLevelUp.skills.Marksman = state.currentLevelUp.skills.Marksmanship;
          }

          if (state.abilityModifiers) {
            // @ts-expect-error: Migrating from old state types
            newState.abilityModifiers.Marksman = state.abilityModifiers.Marksmanship;
          }

          if (state.majorSkills) {
            newState.majorSkills = state.majorSkills.map((skill) =>
              // @ts-expect-error: Migrating from old state types
              skill === 'Marksmanship' ? 'Marksman' : skill,
            );
          }

          console.log('Finished migrating!');
          return newState;
        }

        return persistedState;
      },
    },
  ),
);

export { useCharacterStore };
