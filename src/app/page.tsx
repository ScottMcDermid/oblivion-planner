"use client";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import DropDown from "@/components/DropDown";
import LevelUpDialog from "@/components/LevelUpDialog";
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
import { Level, levelTemplate, LevelUp, levelUpTemplate } from "@/types/level";
import { Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AddIcon from "@mui/icons-material/Add";
import { applyLevelUpToLevel, getBaseLevel } from "@/services/Level";
import races from "@/data/races";
import birthsigns from "@/data/birthsigns";
import skills from "@/data/skills";

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
  const [openLevelUpDialog, setOpenLevelUpDialog] = useState<boolean>(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelUps, setLevelUps] = useState<LevelUp[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>(levelTemplate);
  const [nextLevel, setNextLevel] = useState<Level>(levelTemplate);
  const [nextLevelUp, setNextLevelUp] = useState<LevelUp>(levelUpTemplate);
  const [isLevelingUp, setIsLevelingUp] = useState<boolean>(false);

  const addLevelUp = (levelUp: LevelUp): void => {
    setLevelUps(levelUps.concat(levelUp));
  };

  const promptRemoveLevel = (level: number) => {
    console.log("remove level? " + level);
  };

  const toggleIsLevelingUp = () => {
    setIsLevelingUp(!isLevelingUp);
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

  useEffect(() => {
    setNextLevel(applyLevelUpToLevel(currentLevel, nextLevelUp));
  }, [currentLevel, nextLevelUp]);

  useEffect(() => {
    setNextLevel(applyLevelUpToLevel(currentLevel, nextLevelUp));
  }, [currentLevel, nextLevelUp]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="p-2 font-[family-name:var(--font-geist-sans)] flex flex-row">
        <Box className="p-3">
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
        </Box>
        <Box className="p-3 flex-grow">
          <Typography className="text-3xl my-2">Leveling</Typography>
          {levels.length > 0 ? (
            <TableContainer>
              <Table sx={{ maxWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" component="th">
                      Level
                    </TableCell>
                    {attributes.map((attribute) => (
                      <TableCell component="th" align="right" key={attribute}>
                        {attribute}
                      </TableCell>
                    ))}
                    <TableCell align="right" component="th">
                      Health
                    </TableCell>
                    <TableCell align="right" component="th">
                      Magicka
                    </TableCell>
                    <TableCell align="right" component="th">
                      Stamina
                    </TableCell>
                    <TableCell align="right" component="th">
                      Encumbrance
                    </TableCell>
                    <TableCell component="th"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levels.map((level, i) => (
                    <LevelRow
                      key={level.level}
                      level={level}
                      {...(level.level > 1
                        ? {
                            onDeleteHandler: () =>
                              promptRemoveLevel(level.level),
                          }
                        : {})}
                      previousLevel={levels[i - 1]}
                    />
                  ))}
                  {isLevelingUp ? (
                    <LevelRow
                      level={nextLevel}
                      previousLevel={currentLevel}
                      onDeleteHandler={() => toggleIsLevelingUp()}
                    />
                  ) : null}
                </TableBody>
                <TableFooter>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" colSpan={attributes.length + 6}>
                      {isLevelingUp ? (
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => toggleIsLevelingUp()}
                          className="w-full"
                        >
                          <Typography className="pt-1">Level Up</Typography>
                          <ArrowUpwardIcon />
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="large"
                          className="w-full"
                          onClick={() => toggleIsLevelingUp()}
                        >
                          <Typography className="pt-1">
                            Plan Next Level
                          </Typography>
                          <AddIcon />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          ) : (
            <div>
              <Skeleton height={100} />
            </div>
          )}
        </Box>
        {openLevelUpDialog ? (
          <LevelUpDialog
            currentLevel={currentLevel}
            majorSkills={majorSkills}
            handleLevelUp={addLevelUp}
            handleClose={() => {
              setOpenLevelUpDialog(false);
            }}
          />
        ) : null}
      </div>
    </ThemeProvider>
  );
}
