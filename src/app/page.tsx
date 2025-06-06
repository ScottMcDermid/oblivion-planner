'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import { Button, StyledEngineProvider, Switch } from '@mui/material';

import theme from '@/app/theme';

import type { Level, LevelUp } from '@/utils/levelUtils';

import LevelRow from '@/components/LevelRow';
import ModifyLevelRow from '@/components/ModifyLevelRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import CharacterDialog from '@/components/CharacterDialog';

import { useCharacterStore } from '@/data/characterStore';

import attributes, { shorthandByAttribute } from '@/utils/attributeUtils';
import { applyLevelUpToLevel, getBaseLevel } from '@/utils/levelUtils';
import RemasteredModifyLevelRow from '@/components/RemasteredModifyLevelRow';
import RemasteredLevelRow from '@/components/RemasteredLevelRow';

export default function Home() {
  const {
    remastered,
    isFirstVisit,
    race,
    gender,
    birthsign,
    specialization,
    favoredAttributes,
    majorSkills,
    currentLevel,
    currentLevelUp,
    levels,
    levelUps,
    actions: { setCharacterData, setLevelUp, removeLevel, setLevels, resetLevels },
  } = useCharacterStore();

  const [isCharacterCreationOpen, setIsCharacterCreationOpen] = useState<boolean>(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [isConfirmingRemastered, setIsConfirmingRemastered] = useState<boolean>(false);
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

  const handleRemasteredToggle = (confirm: boolean) => {
    if (confirm) {
      setCharacterData({ remastered: !remastered });
      resetLevels();
    }
    setIsConfirmingRemastered(false);
  };

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetLevels();
    }
    setIsConfirmingReset(false);
  };

  useEffect(() => {
    if (useCharacterStore.persist.hasHydrated() && useCharacterStore.getState().isFirstVisit) {
      setIsCharacterCreationOpen(true);
      setCharacterData({ isFirstVisit: false });
    }
  }, [isFirstVisit, setCharacterData]);

  useEffect(() => {
    setLevels(
      levelUps.reduce(
        (levels: Level[], levelUp, i) => [
          ...levels,
          applyLevelUpToLevel(levels[i], levelUp, remastered),
        ],
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
    remastered,
  ]);

  const handleLevelUpChange = (levelUp: LevelUp) => setCharacterData({ currentLevelUp: levelUp });
  const handleCommitLevelUp = (levelUp: LevelUp) =>
    modifyingLevel !== null ? commitLevelUp(levelUp, modifyingLevel) : commitLevelUp(levelUp);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex h-screen flex-col place-items-center overflow-y-auto bg-inherit">
          <h1 className="absolute items-center text-lg">Oblivion Planner</h1>
          <div className="flex w-full flex-row justify-between pl-2 pt-6 sm:pt-2">
            <div className="flex place-items-center">
              <Button
                variant="contained"
                aria-label="Character Creation"
                onClick={() => {
                  setIsCharacterCreationOpen(true);
                }}
              >
                <PersonIcon />
                <div className="hidden sm:block">Character</div>
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
                  <div className="hidden sm:block">Reset</div>
                </Button>
              )}
            </div>
            <div className="flex place-items-center">
              <div>Remastered</div>
              <Switch
                checked={remastered}
                color="secondary"
                onClick={() => {
                  if (levels.length > 1) setIsConfirmingRemastered(true);
                  else handleRemasteredToggle(true);
                }}
              />
            </div>
          </div>

          {/* Table Header */}
          <div
            className="sticky top-0 z-10 grid w-full max-w-8xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center bg-inherit shadow-lg sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
            style={{ gridAutoRows: 'minmax(3rem, auto)' }}
          >
            <div className="sm:text-lg">
              <span className="inline lg:hidden">LVL</span>
              <span className="hidden lg:inline">Level</span>
            </div>
            {attributes.map((attribute) => (
              <div className="sm:text-lg" key={attribute}>
                <span className="inline lg:hidden">{shorthandByAttribute[attribute]}</span>
                <span className="hidden lg:inline">{attribute}</span>
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
                className="grid w-full max-w-8xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                style={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                {levels.map((level, i) =>
                  modifyingLevel !== null && modifyingLevel === level.level ? (
                    remastered ? (
                      <RemasteredModifyLevelRow
                        key={level.level}
                        level={levels[i - 1]}
                        levelUp={levelUps[level.level - 2]}
                        onCommitLevelUp={handleCommitLevelUp}
                        onCancelHandler={() => setModifyingLevel(null)}
                      />
                    ) : (
                      <ModifyLevelRow
                        key={level.level}
                        level={levels[i - 1]}
                        levelUp={levelUps[level.level - 2]}
                        onCommitLevelUp={handleCommitLevelUp}
                        onCancelHandler={() => setModifyingLevel(null)}
                      />
                    )
                  ) : remastered ? (
                    <RemasteredLevelRow
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
                  ) : remastered ? (
                    <RemasteredLevelRow
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
                className="grid w-full max-w-8xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center pb-24 sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                style={{ gridAutoRows: 'minmax(3rem, auto)' }}
              >
                {remastered ? (
                  <RemasteredModifyLevelRow
                    level={currentLevel}
                    levelUp={currentLevelUp}
                    onLevelUpChange={handleLevelUpChange}
                    onCommitLevelUp={handleCommitLevelUp}
                  />
                ) : (
                  <ModifyLevelRow
                    level={currentLevel}
                    levelUp={currentLevelUp}
                    onLevelUpChange={handleLevelUpChange}
                    onCommitLevelUp={handleCommitLevelUp}
                  />
                )}
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
        <ConfirmDialog
          open={isConfirmingReset}
          description="This will delete all levels"
          handleClose={handleReset}
        />
        <ConfirmDialog
          open={isConfirmingRemastered}
          description="This will delete all levels"
          handleClose={handleRemasteredToggle}
        />
        <CharacterDialog
          open={isCharacterCreationOpen}
          remastered={remastered}
          handleClose={() => setIsCharacterCreationOpen(false)}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
