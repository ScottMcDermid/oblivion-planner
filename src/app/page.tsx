'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportContacts from '@mui/icons-material/ImportContacts';
import Skeleton from '@mui/material/Skeleton';
import { Button, StyledEngineProvider, Switch } from '@mui/material';

import theme from '@/app/theme';

import type { Level, LevelUp } from '@/utils/levelUtils';

import LevelRow from '@/components/LevelRow';
import ModifyLevelRow from '@/components/ModifyLevelRow';
import ConfirmDialog from '@/components/ConfirmDialog';
import CharacterDialog from '@/components/CharacterDialog';
import AbilitiesDialog from '@/components/AbilitiesDialog';

import { useCharacterStore } from '@/data/characterStore';

import attributes, { shorthandByAttribute } from '@/utils/attributeUtils';
import { applyLevelUpToLevel, getBaseLevel } from '@/utils/levelUtils';
import RemasteredModifyLevelRow from '@/components/RemasteredModifyLevelRow';
import RemasteredLevelRow from '@/components/RemasteredLevelRow';

export default function Home() {
  const {
    remastered,
    abilityModifiers,
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
  const [isAbilitiesOpen, setIsAbilitiesOpen] = useState<boolean>(false);
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
                <div className="hidden sm:block">&nbsp;Character</div>
              </Button>
              {levels.length > 1 && (
                <Button
                  className="mx-2"
                  color="error"
                  aria-label="Reset Character"
                  onClick={() => {
                    setIsConfirmingReset(true);
                  }}
                >
                  <DeleteIcon />
                  <div className="hidden sm:block">&nbsp;Reset</div>
                </Button>
              )}
            </div>

            <div className="flex place-items-center">
              <Button
                className="mx-2"
                aria-label=""
                onClick={() => {
                  setIsAbilitiesOpen(true);
                }}
              >
                <ImportContacts />
                <div className="hidden sm:block">&nbsp;Abilities</div>
              </Button>
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
                        abilities={abilityModifiers}
                        level={levels[i - 1]}
                        levelUp={levelUps[level.level - 2]}
                        onCommitLevelUp={handleCommitLevelUp}
                        onCancelHandler={() => setModifyingLevel(null)}
                      />
                    ) : (
                      <ModifyLevelRow
                        key={level.level}
                        abilities={abilityModifiers}
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
                      abilities={abilityModifiers}
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
                    abilities={abilityModifiers}
                    level={currentLevel}
                    levelUp={currentLevelUp}
                    onLevelUpChange={handleLevelUpChange}
                    onCommitLevelUp={handleCommitLevelUp}
                  />
                ) : (
                  <ModifyLevelRow
                    abilities={abilityModifiers}
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

        <footer className="mt-16 w-full border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-center sm:text-left">
            <div className="space-y-2">
              <p>Oblivion Tool Suite © 2025 Scott McDermid</p>
              <p>
                Licensed under the{' '}
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.html"
                  className="underline hover:text-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GNU General Public License v3.0
                </a>
                .
              </p>
              <p>
                The Elder Scrolls and Oblivion are trademarks of Bethesda Softworks LLC, a ZeniMax
                Media company.
              </p>
              <p>This site is fan-made and not affiliated with Bethesda.</p>
            </div>
            <div className="flex w-full justify-end">
              <a
                href="https://github.com/ScottMcDermid/oblivion-planner"
                className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1 text-xs font-medium text-gray-400 transition hover:border-gray-600 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-current"
                  focusable="false"
                >
                  <path d="M12 .297C5.375.297 0 5.67 0 12.297c0 5.302 3.438 9.799 8.205 11.387.6.112.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.203.085 1.836 1.236 1.836 1.236 1.07 1.835 2.808 1.305 3.492.998.108-.775.418-1.305.762-1.606-2.665-.303-5.467-1.334-5.467-5.934 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.628-5.48 5.923.43.37.823 1.096.823 2.21 0 1.595-.015 2.882-.015 3.274 0 .32.22.694.825.576C20.565 22.092 24 17.597 24 12.297 24 5.67 18.627.297 12 .297z" />
                </svg>
                <span className="uppercase tracking-wide">GitHub</span>
              </a>
            </div>
          </div>
        </footer>

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
        <AbilitiesDialog open={isAbilitiesOpen} handleClose={() => setIsAbilitiesOpen(false)} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
