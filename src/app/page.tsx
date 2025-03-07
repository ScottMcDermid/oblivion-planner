'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import { Button, StyledEngineProvider } from '@mui/material';

import theme from '@/app/theme';

import type { Level, LevelUp } from '@/utils/levelUtils';

import LevelRow from '@/components/LevelRow';
import ModifyLevelRow from '@/components/ModifyLevelRow';
import ConfirmDialog from '@/components/ConfirmDialog';

import { useCharacterStore } from '@/data/characterStore';

import attributes from '@/utils/attributeUtils';
import { applyLevelUpToLevel, getBaseLevel } from '@/utils/levelUtils';
import CharacterCreation from '@/components/CharacterCreation';

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
    actions: { setLevelUp, removeLevel, setLevels, resetLevels },
  } = useCharacterStore();

  const [isCharacterCreationOpen, setIsCharacterCreationOpen] = useState<boolean>(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
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

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetLevels();
    }
    setIsConfirmingReset(false);
  };

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

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CharacterCreation
          open={isCharacterCreationOpen}
          handleClose={() => setIsCharacterCreationOpen(false)}
        />

        <div className="flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <div className="space-between flex w-full flex-row">
            <Button
              aria-label="Character Creation"
              onClick={() => {
                setIsCharacterCreationOpen(true);
              }}
            >
              <PersonIcon />
              <div>Character</div>
            </Button>
            {levels.length > 1 && (
              <Button
                color="error"
                aria-label="Reset Character"
                onClick={() => {
                  setIsConfirmingReset(true);
                }}
              >
                <DeleteIcon />
                <div>Reset</div>
              </Button>
            )}
          </div>

          {/* Table Header */}
          <div
            className="sticky top-0 z-10 grid w-full max-w-7xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center bg-inherit shadow-lg sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
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
              <div
                className="grid w-full max-w-7xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                style={{ gridAutoRows: 'minmax(3rem, auto)' }}
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
              </div>

              {/* Table Footer */}
              <div
                className="grid w-full max-w-7xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center pb-24 sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                style={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                <ModifyLevelRow
                  level={currentLevel}
                  commitLevelUpHandler={(levelUp) => commitLevelUp(levelUp)}
                />
              </div>
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
        </div>
        <ConfirmDialog open={removingLevel !== null} handleClose={handleRemoveLevel} />
        <ConfirmDialog open={isConfirmingReset} handleClose={handleReset} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
