'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import PersonIcon from '@mui/icons-material/Person';
import Skeleton from '@mui/material/Skeleton';
import { Drawer, Fab, StyledEngineProvider, Tooltip, Typography } from '@mui/material';

import theme from '@/app/theme';

import type { Level, LevelUp } from '@/utils/levelUtils';
import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';

import DropDown from '@/components/DropDown';
import RadioButtons from '@/components/RadioButtons';
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
      setFavoredAttributesError(
        `you must choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`,
      );
    } else {
      setFavoredAttributesError('');
    }
  }, [favoredAttributes]);
  useEffect(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      setMajorSkillsError(`you must choose exactly ${NUM_MAJOR_SKILLS} major skills`);
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
          sx={{
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
          anchor="left"
          className="p-3"
        >
          <Box className="p-2">
            <Typography className="my-2 text-3xl">Character</Typography>
            <DropDown
              label="Race"
              value={race}
              options={races}
              onChangeHandler={(race) => setCharacterData({ race: race as Race })}
            />
            <RadioButtons
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
          </Box>
          <Divider className="my-4" />
          <Box className="p-2">
            <Typography className="my-2 text-3xl">Class</Typography>
            <RadioButtons
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
          </Box>
        </Drawer>

        <Box className="align-center flex flex-col content-center font-[family-name:var(--font-geist-sans)]">
          <Box className="hidden lg:block">
            <Tooltip title="Character Creation">
              <Fab
                size="small"
                className="m-4 min-w-10"
                color="default"
                aria-label="Character Creation"
                onClick={() => {
                  setIsCharacterCreationOpen(true);
                }}
              >
                <PersonIcon />
              </Fab>
            </Tooltip>
          </Box>

          {levels.length > 0 ? (
            <Box className="mx-auto place-items-center overflow-hidden">
              {/* Table Header */}
              <Box
                className="grid w-full grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                sx={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                <Typography className="sm:text-lg">LVL</Typography>
                {attributes.map((attribute) => (
                  <Typography className="sm:text-lg" key={attribute}>
                    {attribute}
                  </Typography>
                ))}
                <div className="px0 hidden xl:block">Health</div>
                <div className="px0 hidden xl:block">Magicka</div>
                <div className="px0 hidden xl:block">Stamina</div>
                <div className="px0 hidden xl:block">Encumbrance</div>

                {/* Padding for modify level row */}
                <div></div>
              </Box>

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
                {modifyingLevel ? null : (
                  <>
                    <ModifyLevelRow
                      level={currentLevel}
                      commitLevelUpHandler={(levelUp) => commitLevelUp(levelUp)}
                    />
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <div className="w-1/2 p-5">
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
