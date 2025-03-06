'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import Skeleton from '@mui/material/Skeleton';
import { Drawer, Button, StyledEngineProvider } from '@mui/material';

import theme from '@/app/theme';

import type { Level, LevelUp } from '@/utils/levelUtils';
import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';

import DropDown from '@/components/DropDown';
import SelectFromList from '@/components/SelectFromList';
import LevelRow from '@/components/LevelRow';
import ModifyLevelRow from '@/components/ModifyLevelRow';
import ConfirmDialog from '@/components/ConfirmDialog';

import { useCharacterStore } from '@/data/characterStore';

import attributes, { Attribute, NUM_FAVORED_ATTRIBUTES } from '@/utils/attributeUtils';
import specializations from '@/utils/specializationUtils';
import races from '@/utils/raceUtils';
import genders from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import skills, { NUM_MAJOR_SKILLS } from '@/utils/skillUtils';
import { Skill } from '@/utils/skillUtils';
import { applyLevelUpToLevel, getBaseLevel } from '@/utils/levelUtils';
import ToggleButtons from '@/components/ToggleButtons';

export default function Home() {
  const {
    race,
    gender,
    birthsign,
    specialization,
    favoredAttributes,
    majorSkills,
    currentLevel,
    levels,
    levelUps,
    actions: { setCharacterData, setLevelUp, removeLevel, setLevels },
  } = useCharacterStore();

  const [isCharacterCreationOpen, setIsCharacterCreationOpen] = useState<boolean>(false);
  const [modifyingLevel, setModifyingLevel] = useState<number | null>(null);
  const [removingLevel, setRemovingLevel] = useState<number | null>(null);

  const commitLevelUp = (levelUp: LevelUp, level?: number): void => {
    setLevelUp(levelUp, level);
    setModifyingLevel(null);
  };
  const promptConfirmRemoveLevel = (level: number) => {
    setRemovingLevel(level);
  };
  const handleRemoveLevel = (confirm: boolean) => {
    if (confirm && removingLevel) {
      removeLevel(removingLevel);
    }
    setRemovingLevel(null);
  };

  const [favoredAttributesError, setFavoredAttributesError] = useState('');
  const [majorSkillsError, setMajorSkillsError] = useState('');

  useEffect(() => {
    setLevels(
      levelUps.reduce(
        (levels: Level[], levelUp, i) => [...levels, applyLevelUpToLevel(levels[i], levelUp)],
        [getBaseLevel(race, gender, birthsign, specialization, favoredAttributes, majorSkills)],
      ),
    );
  }, [
    race,
    gender,
    birthsign,
    specialization,
    favoredAttributes,
    levelUps,
    majorSkills,
    setLevels,
  ]);

  // validation
  useEffect(() => {
    if (favoredAttributes.length !== NUM_FAVORED_ATTRIBUTES) {
      setFavoredAttributesError(`Choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`);
    } else {
      setFavoredAttributesError('');
    }
  }, [favoredAttributes]);
  useEffect(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      setMajorSkillsError(`Choose exactly ${NUM_MAJOR_SKILLS} major skills`);
    } else {
      setMajorSkillsError('');
    }
  }, [majorSkills]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Drawer
          onClose={() => {
            setIsCharacterCreationOpen(false);
          }}
          open={isCharacterCreationOpen}
          anchor="left"
        >
          <div className="p-3">
            <div className="my-2 text-3xl">Character</div>
            <DropDown
              label="Race"
              value={race}
              options={races}
              onChangeHandler={(race) => setCharacterData({ race: race as Race })}
            />
            <ToggleButtons
              name="Gender"
              value={gender}
              options={genders}
              onChangeHandler={(gender) => setCharacterData({ gender: gender as Gender })}
            />
            <DropDown
              label="Birthsign"
              value={birthsign}
              options={birthsigns}
              onChangeHandler={(birthsign) =>
                setCharacterData({ birthsign: birthsign as Birthsign })
              }
            />
            <Divider className="my-4" />
            <div className="my-2 text-3xl">Class</div>
            <ToggleButtons
              label="Specialization"
              name="Specialization"
              value={specialization}
              options={specializations}
              onChangeHandler={(specialization) =>
                setCharacterData({
                  specialization: specialization as Specialization,
                })
              }
            />
            <SelectFromList
              label="Favored Attributes"
              selectedOptions={favoredAttributes}
              error={favoredAttributesError}
              onChangeHandler={(favoredAttributes) =>
                setCharacterData({
                  favoredAttributes: favoredAttributes as Attribute[],
                })
              }
              options={attributes}
            />
            <SelectFromList
              label="Major Skills"
              selectedOptions={majorSkills}
              error={majorSkillsError}
              onChangeHandler={(majorSkills) =>
                setCharacterData({ majorSkills: majorSkills as Skill[] })
              }
              options={skills}
            />
          </div>
        </Drawer>

        <Box className="mx-auto flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <div className="flex w-full flex-row justify-start">
            <Button
              aria-label="Character Creation"
              onClick={() => {
                setIsCharacterCreationOpen(true);
              }}
            >
              <PersonIcon />
              <div>Character</div>
            </Button>
          </div>

          {/* Table Header */}
          <div
            className="sticky top-0 z-10 grid w-full grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center bg-inherit shadow-lg sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
            style={{ gridAutoRows: 'minmax(3rem, auto)' }}
          >
            <div className="sm:text-lg">LVL</div>
            {attributes.map((attribute) => (
              <div className="sm:text-lg" key={attribute}>
                {attribute}
              </div>
            ))}
            <div className="px0 hidden xl:block">Health</div>
            <div className="px0 hidden xl:block">Magicka</div>
            <div className="px0 hidden xl:block">Stamina</div>
            <div className="px0 hidden xl:block">Encumbrance</div>

            {/* Padding for modify level row */}
            <div></div>
          </div>

          {levels.length > 0 ? (
            <>
              {/* Table Body */}
              <Box
                className="grid w-full grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                sx={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                {levels.map((level, i) =>
                  modifyingLevel !== null && modifyingLevel === level.level ? (
                    <>
                      <ModifyLevelRow
                        key={level.level}
                        level={levels[i - 1]}
                        levelUp={levelUps[level.level - 2]}
                        commitLevelUpHandler={(levelUp) => commitLevelUp(levelUp, level.level)}
                      />
                    </>
                  ) : (
                    <LevelRow
                      key={level.level}
                      level={level}
                      {...(level.level > 1
                        ? {
                            onRemoveHandler: () => promptConfirmRemoveLevel(level.level),
                            onModifyHandler: () => setModifyingLevel(level.level),
                          }
                        : {})}
                      previousLevel={levels[i - 1]}
                    />
                  ),
                )}
              </Box>

              {/* Table Footer */}
              <Box
                className="grid w-full grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                sx={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                <ModifyLevelRow
                  level={currentLevel}
                  commitLevelUpHandler={(levelUp) => commitLevelUp(levelUp)}
                />
              </Box>
            </>
          ) : (
            <div className="w-11/12 p-5">
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
              <Skeleton height={50} />
            </div>
          )}
        </Box>
        <ConfirmDialog open={removingLevel !== null} handleClose={handleRemoveLevel} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
