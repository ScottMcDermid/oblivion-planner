"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import DropDown from "@/components/DropDown";
import RadioButtons from "@/components/RadioButtons";
import SelectFromList from "@/components/SelectFromList";
import LevelRow from "@/components/LevelRow";

import theme from "@/app/theme";
import type { Race } from "@/data/races";
import type { Birthsign } from "@/data/birthsigns";
import attributes from "@/data/attributes";
import type { Attribute } from "@/data/attributes";
import type { Skill } from "@/data/skills";
import specializations from "@/data/specializations";
import type { Specialization } from "@/data/specializations";
import genders from "@/data/genders";
import type { Gender } from "@/data/genders";
import { Level, levelTemplate, LevelUp } from "@/types/level";
import {
  Drawer,
  Fab,
  StyledEngineProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { applyLevelUpToLevel, getBaseLevel } from "@/services/Level";
import races from "@/data/races";
import birthsigns from "@/data/birthsigns";
import skills from "@/data/skills";
import ModifyLevelRow from "@/components/ModifyLevelRow";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  const NUM_FAVORED_ATTRIBUTES = 2;
  const NUM_MAJOR_SKILLS = 7;

  const [race, setRace] = useState<Race>(races[0]);
  const [gender, setGender] = useState<Gender>(genders[0]);
  const [birthsign, setBirthsign] = useState<Birthsign>(birthsigns[0]);
  const [specialization, setSpecialization] = useState<Specialization>(
    specializations[0],
  );
  const [favoredAttributes, setFavoredAttributes] = useState<Attribute[]>(
    attributes.slice(0, NUM_FAVORED_ATTRIBUTES),
  );
  const [favoredAttributesError, setFavoredAttributesError] = useState<
    string | null
  >(null);
  const [majorSkills, setMajorSkills] = useState<Skill[]>(
    skills.slice(0, NUM_MAJOR_SKILLS),
  );
  const [majorSkillsError, setMajorSkillsError] = useState<string>("");

  const [currentLevel, setCurrentLevel] = useState<Level>(levelTemplate);
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelUps, setLevelUps] = useState<LevelUp[]>([]);
  const [isCharacterCreationOpen, setIsCharacterCreationOpen] =
    useState<boolean>(false);
  const [modifyingLevel, setModifyingLevel] = useState<number | null>(null);
  const [removingLevel, setRemovingLevel] = useState<number | null>(null);

  const commitLevelUp = (levelUp: LevelUp, level?: number): void => {
    const levelIndex = level === undefined ? levelUps.length : level - 2;
    const newLevelUps = levelUps.slice(0);
    newLevelUps[levelIndex] = levelUp;
    setLevelUps(newLevelUps);
    setModifyingLevel(null);
  };

  const promptConfirmRemoveLevel = (level: number) => {
    setRemovingLevel(level);
  };

  const handleRemoveLevel = (confirm: boolean) => {
    if (!confirm || !removingLevel) return;
    const newLevelUps = levelUps.slice(0);
    newLevelUps.splice(removingLevel - 2, 1);
    setLevelUps(newLevelUps);
    setRemovingLevel(null);
  };

  useEffect(() => {
    setLevels(
      levelUps.reduce(
        (levels: Level[], levelUp, i) => [
          ...levels,
          applyLevelUpToLevel(levels[i], levelUp),
        ],
        [
          getBaseLevel(
            race,
            gender,
            birthsign,
            specialization,
            favoredAttributes,
            majorSkills,
          ),
        ],
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
  ]);

  useEffect(() => {
    if (levels.length > 0) {
      setCurrentLevel(levels[levels.length - 1]);
    }
  }, [levels]);

  // validation
  useEffect(() => {
    if (favoredAttributes.length !== NUM_FAVORED_ATTRIBUTES) {
      setFavoredAttributesError(
        `you must choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`,
      );
    } else {
      setFavoredAttributesError("");
    }
  }, [favoredAttributes]);
  useEffect(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      setMajorSkillsError(
        `you must choose exactly ${NUM_MAJOR_SKILLS} major skills`,
      );
    } else {
      setMajorSkillsError("");
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
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
            },
          }}
          anchor="left"
          className="p-3"
        >
          <Box className="p-2">
            <Typography className="text-3xl my-2">Character</Typography>
            <DropDown
              label="Race"
              value={race}
              options={races}
              onChangeHandler={setRace as (a: string) => void}
            />
            <RadioButtons
              name="Gender"
              value={gender}
              options={genders}
              onChangeHandler={setGender as (a: string) => void}
            />
            <DropDown
              label="Birthsign"
              value={birthsign}
              options={birthsigns}
              onChangeHandler={setBirthsign as (a: string) => void}
            />
          </Box>
          <Divider className="my-4" />
          <Box className="p-2">
            <Typography className="text-3xl my-2">Class</Typography>
            <RadioButtons
              label="Specialization"
              name="Specialization"
              value={specialization}
              options={specializations}
              onChangeHandler={setSpecialization as (a: string) => void}
            />
            <SelectFromList
              label="Favored Attributes"
              selectedOptions={favoredAttributes}
              error={favoredAttributesError}
              onChangeHandler={setFavoredAttributes as (a: string[]) => void}
              options={attributes}
            />
            <SelectFromList
              label="Major Skills"
              selectedOptions={majorSkills}
              error={majorSkillsError}
              onChangeHandler={setMajorSkills as (a: string[]) => void}
              options={skills}
            />
          </Box>
        </Drawer>

        <Box className="font-[family-name:var(--font-geist-sans)] flex flex-col align-center content-center">
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
          <Box className="mx-auto overflow-hidden max-h-screen">
            {levels.length > 0 ? (
              <TableContainer className="max-h-screen">
                <Table stickyHeader size="small" aria-label="Levels">
                  <TableHead className="sticky">
                    <TableRow>
                      <TableCell align="center" component="th" className="px-0">
                        <Typography className="hidden lg:show">
                          Level
                        </Typography>
                        <Typography className="show lg:hidden">LVL</Typography>
                      </TableCell>
                      {attributes.map((attribute) => (
                        <TableCell
                          component="th"
                          className="px-0 w-3/12"
                          align="center"
                          key={attribute}
                        >
                          {attribute}
                        </TableCell>
                      ))}
                      <TableCell
                        className="hidden 2xl:table-cell px0"
                        align="center"
                        component="th"
                      >
                        Health
                      </TableCell>
                      <TableCell
                        className="hidden 2xl:table-cell px0"
                        align="center"
                        component="th"
                      >
                        Magicka
                      </TableCell>
                      <TableCell
                        className="hidden 2xl:table-cell px0"
                        align="center"
                        component="th"
                      >
                        Stamina
                      </TableCell>
                      <TableCell
                        className="hidden 2xl:table-cell px0"
                        align="center"
                        component="th"
                      >
                        Encumbrance
                      </TableCell>
                      <TableCell component="th" className="px0" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {levels.map((level, i) =>
                      modifyingLevel !== null &&
                      modifyingLevel === level.level ? (
                        <ModifyLevelRow
                          key={level.level}
                          level={levels[i - 1]}
                          levelUp={levelUps[level.level - 2]}
                          majorSkills={majorSkills}
                          commitLevelUpHandler={(levelUp) =>
                            commitLevelUp(levelUp, level.level)
                          }
                        />
                      ) : (
                        <LevelRow
                          key={level.level}
                          level={level}
                          {...(level.level > 1
                            ? {
                                onRemoveHandler: () =>
                                  promptConfirmRemoveLevel(level.level),
                                onModifyHandler: () =>
                                  setModifyingLevel(level.level),
                              }
                            : {})}
                          previousLevel={levels[i - 1]}
                        />
                      ),
                    )}
                    {modifyingLevel ? null : (
                      <ModifyLevelRow
                        level={currentLevel}
                        majorSkills={majorSkills}
                        commitLevelUpHandler={(levelUp) =>
                          commitLevelUp(levelUp)
                        }
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div>
                <Skeleton height={100} />
              </div>
            )}
          </Box>
        </Box>
        <ConfirmDialog
          open={removingLevel !== null}
          handleClose={handleRemoveLevel}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
