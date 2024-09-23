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

import theme from "@/app/theme";
import races, { raceModifiers } from "@/data/races";
import type { Race } from "@/data/races";
import birthsigns, { birthsignModifiers } from "@/data/birthsigns";
import type { Birthsign } from "@/data/birthsigns";
import attributes, { baseAttributes } from "@/data/attributes";
import type { Attribute, AttributesModifier } from "@/data/attributes";
import skills, { baseSkills } from "@/data/skills";
import type { SkillsModifier, Skill } from "@/data/skills";
import specializations from "@/data/specializations";
import type { Specialization } from "@/data/specializations";
import genders from "@/data/genders";
import type { Gender } from "@/data/genders";
import type { Level, LevelUp } from "@/types/level";
import { Typography } from "@mui/material";

export default function Home() {
  const ENCUMBRANCE_MULTIPLIER = 5;
  const BASE_HEALTH_MULTIPLIER = 2;
  const HEALTH_MULTIPLIER = 1 / 10;
  const MAGICKA_MULTIPLIER = 2;
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
  const [currentLevel, setCurrentLevel] = useState<Level | undefined>();

  const addLevelUp = function (levelUp: LevelUp): void {
    setLevelUps(levelUps.concat(levelUp));
  };

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

  useEffect(() => {
    // compute base level
    const birthsignAttributeModifiers =
      birthsignModifiers[birthsign].attributes ?? {};
    const newAttributes: AttributesModifier = attributes.reduce(
      (newAttributes, attribute) => {
        const base = baseAttributes[attribute] ?? 0;
        const birthsignModifier = birthsignAttributeModifiers[attribute] ?? 0;
        const modifier: number =
          raceModifiers[race].attributes[gender][attribute] ?? 0;
        return {
          ...newAttributes,
          [attribute]: base + modifier + birthsignModifier,
        };
      },
      {},
    );
    const newSkills: SkillsModifier = skills.reduce((newSkills, skill) => {
      const base = baseSkills[skill] ?? 0;
      const modifier: number = raceModifiers[race].skills[skill] ?? 0;
      return {
        ...newSkills,
        [skill]: base + modifier,
      };
    }, {});

    const { AGL = 0, END = 0, INT = 0, STR = 0, WIL = 0 } = newAttributes;
    const health = END * BASE_HEALTH_MULTIPLIER;

    // compute magicka
    const birthsignMagickaBonus = birthsignModifiers[birthsign].magicka ?? 0;
    const raceMagickaBonus = raceModifiers[race].magicka ?? 0;
    const baseMagicka = INT * MAGICKA_MULTIPLIER;
    const magicka = baseMagicka + birthsignMagickaBonus + raceMagickaBonus;

    // compute base stamina
    const stamina = END + STR + AGL + WIL;

    // compute base encumbrance
    const encumbrance: number = STR * ENCUMBRANCE_MULTIPLIER;

    const baseLevel = {
      attributes: newAttributes,
      encumbrance,
      health,
      level: 1,
      magicka,
      skills: newSkills,
      stamina,
    };

    const restOfLevels: Level[] = levelUps.reduce(
      (restOfLevels: Level[], levelUp) => {
        const previousLevel =
          restOfLevels.length === 0
            ? baseLevel
            : restOfLevels[restOfLevels.length - 1];

        const newAttributes: AttributesModifier = attributes.reduce(
          (newAttributes, attribute) => {
            const previousAttribute = previousLevel.attributes[attribute] ?? 0;
            const modifier = levelUp.attributes[attribute] ?? 0;
            return {
              ...newAttributes,
              [attribute]: previousAttribute + modifier,
            };
          },
          {},
        );

        const { AGL = 0, END = 0, INT = 0, STR = 0, WIL = 0 } = newAttributes;
        const health =
          previousLevel.health + Math.floor(END * HEALTH_MULTIPLIER);

        // compute magicka
        const birthsignMagickaBonus =
          birthsignModifiers[birthsign].magicka ?? 0;
        const raceMagickaBonus = raceModifiers[race].magicka ?? 0;
        const baseMagicka = INT * MAGICKA_MULTIPLIER;
        const magicka = baseMagicka + birthsignMagickaBonus + raceMagickaBonus;

        // compute base stamina
        const stamina = END + STR + AGL + WIL;

        // compute base encumbrance
        const encumbrance: number = STR * ENCUMBRANCE_MULTIPLIER;

        const newSkills: SkillsModifier = skills.reduce((newSkills, skill) => {
          const previousSkill = previousLevel.skills[skill] ?? 0;
          const modifier = levelUp.skills[skill] ?? 0;
          return {
            ...newSkills,
            [skill]: previousSkill + modifier,
          };
        }, {});

        const nextLevel: Level = {
          level: restOfLevels.length + 2,
          attributes: newAttributes,
          skills: newSkills,
          health,
          magicka,
          stamina,
          encumbrance,
        };

        return [...restOfLevels, nextLevel];
      },
      [],
    );

    setLevels([baseLevel, ...restOfLevels]);
  }, [race, gender, birthsign, specialization, favoredAttributes, levelUps]);

  useEffect(() => {
    setCurrentLevel(levels[levels.length - 1]);
  }, [levels]);

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
          {levels.length > 0 && currentLevel ? (
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levels.map((level, i) => (
                    <TableRow key={level.level}>
                      <TableCell align="right">{level.level}</TableCell>
                      {attributes.map((attribute: Attribute) => (
                        <TableCell key={attribute} align="right">
                          <Typography
                            {...(level.attributes[attribute] &&
                            levels[i - 1] &&
                            level.attributes[attribute] >
                              levels[i - 1].attributes[attribute]!
                              ? { color: "primary" }
                              : {})}
                          >
                            {level.attributes[attribute]}
                          </Typography>
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <Typography
                          {...(level.health &&
                          levels[i - 1] &&
                          level.health > levels[i - 1].health
                            ? { color: "primary" }
                            : {})}
                        >
                          {level.health}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          {...(level.magicka &&
                          levels[i - 1] &&
                          level.magicka > levels[i - 1].magicka
                            ? { color: "primary" }
                            : {})}
                        >
                          {level.magicka}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          {...(level.stamina &&
                          levels[i - 1] &&
                          level.stamina > levels[i - 1].stamina
                            ? { color: "primary" }
                            : {})}
                        >
                          {level.stamina}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          {...(level.encumbrance &&
                          levels[i - 1] &&
                          level.encumbrance > levels[i - 1].encumbrance
                            ? { color: "primary" }
                            : {})}
                        >
                          {level.encumbrance}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" colSpan={attributes.length + 5}>
                      <Button
                        variant="outlined"
                        size="large"
                        className="w-full"
                        onClick={() => setOpenLevelUpDialog(true)}
                      >
                        Plan Level {currentLevel.level + 1}
                      </Button>
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
        {openLevelUpDialog && currentLevel ? (
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
