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
import RadioButtons from "@/components/RadioButtons";
import SelectFromList from "@/components/SelectFromList";
import LevelRow from "@/components/LevelRow";

import theme from "@/app/theme";
import type { Race } from "@/data/races";
import type { Birthsign } from "@/data/birthsigns";
import attributes, {
  attributesSetTemplate,
  getAttributeBonusFromSkillUps,
  skillsByAttribute,
} from "@/data/attributes";
import type { Attribute, AttributesSet } from "@/data/attributes";
import type { Skill, SkillsSet } from "@/data/skills";
import specializations from "@/data/specializations";
import type { Specialization } from "@/data/specializations";
import genders from "@/data/genders";
import type { Gender } from "@/data/genders";
import { Level, levelTemplate, LevelUp } from "@/types/level";
import {
  Checkbox,
  Drawer,
  Fab,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import { applyLevelUpToLevel, getBaseLevel } from "@/services/Level";
import races from "@/data/races";
import birthsigns from "@/data/birthsigns";
import skills, { skillsSetTemplate } from "@/data/skills";
import SkillSelector from "@/components/SkillSelector";

export default function Home() {
  const NUM_FAVORED_ATTRIBUTES = 2;
  const NUM_MAJOR_SKILLS = 7;
  const NUM_MAJOR_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;

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
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelUps, setLevelUps] = useState<LevelUp[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>(levelTemplate);
  const [numMajorSkillUps, setNumMajorSkillUps] = useState<number>(0);
  const [isCharacterCreationOpen, setIsCharacterCreationOpen] =
    useState<boolean>(true);

  // level-up state
  const [isLevelingUp, setIsLevelingUp] = useState<boolean>(false);
  const [nextLevel, setNextLevel] = useState<Level>(levelTemplate);
  const [skillUps, setSkillUps] = useState<SkillsSet>(skillsSetTemplate);
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>([]);
  const [attributeBonuses, setAttributeBonuses] = useState<AttributesSet>(
    attributesSetTemplate,
  );
  const [numRaisedAttributes, setNumRaisedAttributes] = useState<number>(0);

  const commitNextLevelUp = (): void => {
    setLevelUps([
      ...levelUps,
      {
        skills: skillUps,
        attributes: raisedAttributes.reduce(
          (attributes, attribute) => ({
            ...attributes,
            [attribute]: attributeBonuses[attribute],
          }),
          attributesSetTemplate,
        ),
      },
    ]);
    setSkillUps(skillsSetTemplate);
    setRaisedAttributes([]);
  };

  const promptRemoveLevel = (level: number) => {
    console.log("remove level? " + level);
  };

  const toggleIsLevelingUp = () => {
    setIsLevelingUp(!isLevelingUp);
  };

  const handleAttributeToggle = (value: Attribute) => {
    const currentIndex = raisedAttributes.indexOf(value);
    const newChecked = [...raisedAttributes];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setNumRaisedAttributes(newChecked.length);
    setRaisedAttributes(newChecked);
  };

  // compute attribute bonuses
  useEffect(() => {
    const newAttributeBonuses: AttributesSet = attributes.reduce(
      (attributeBonuses, attribute) => {
        const attributeSkillUps: number = skillsByAttribute[attribute].reduce(
          (sum: number, skill: Skill) => {
            return sum + skillUps[skill];
          },
          0,
        );
        const attributeBonus = getAttributeBonusFromSkillUps(attributeSkillUps);
        return { ...attributeBonuses, [attribute]: attributeBonus };
      },
      attributesSetTemplate,
    );
    setAttributeBonuses(newAttributeBonuses);
  }, [skillUps]);

  useEffect(() => {
    const numMajorSkillUps = skills.reduce((sum, skill) => {
      if (majorSkills.includes(skill)) {
        const newSkill = skillUps[skill];
        return sum + newSkill;
      }
      return sum;
    }, 0);
    setNumMajorSkillUps(numMajorSkillUps);
  }, [skillUps, majorSkills]);

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
    setNextLevel(
      applyLevelUpToLevel(currentLevel, {
        skills: skillUps,
        attributes: raisedAttributes.reduce(
          (attributes, attribute) => ({
            ...attributes,
            [attribute]: attributeBonuses[attribute],
          }),
          attributesSetTemplate,
        ),
      }),
    );
  }, [currentLevel, skillUps, raisedAttributes, attributeBonuses]);

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

      <Box className="p-2 font-[family-name:var(--font-geist-sans)] flex flex-col  align-center content-center">
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
        <Box className="mx-auto pt-5">
          {levels.length > 0 ? (
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" component="th">
                      Level
                    </TableCell>
                    {attributes.map((attribute) => (
                      <TableCell component="th" align="center" key={attribute}>
                        {attribute}
                      </TableCell>
                    ))}
                    <TableCell align="center" component="th">
                      Health
                    </TableCell>
                    <TableCell align="center" component="th">
                      Magicka
                    </TableCell>
                    <TableCell align="center" component="th">
                      Stamina
                    </TableCell>
                    <TableCell align="center" component="th">
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
                    <>
                      <TableRow>
                        <TableCell></TableCell>
                        {attributes.map((attribute) => (
                          <TableCell key={attribute}>
                            {skillsByAttribute[attribute].map((skill) => (
                              <Box key={skill} className="pb-2">
                                <SkillSelector
                                  skill={skill}
                                  color={
                                    skillUps[skill] > 0
                                      ? "secondary"
                                      : skillUps[skill] < 0
                                        ? "error"
                                        : ""
                                  }
                                  value={
                                    currentLevel.skills[skill] + skillUps[skill]
                                  }
                                  major={majorSkills.includes(skill)}
                                  incrementHandler={() =>
                                    setSkillUps({
                                      ...skillUps,
                                      [skill]: skillUps[skill] + 1,
                                    })
                                  }
                                  decrementHandler={() =>
                                    setSkillUps({
                                      ...skillUps,
                                      [skill]: skillUps[skill] - 1,
                                    })
                                  }
                                />
                              </Box>
                            ))}
                          </TableCell>
                        ))}
                        <TableCell colSpan={5}></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell />
                        {attributes.map((attribute) => (
                          <TableCell align="center" key={attribute}>
                            <Typography
                              {...(raisedAttributes.includes(attribute)
                                ? { color: "secondary" }
                                : {})}
                              className="h-full selfCenter"
                            >
                              {`${currentLevel.attributes[attribute]} + ${attributeBonuses[attribute]}`}
                            </Typography>
                            <Checkbox
                              key={attribute}
                              color="default"
                              checked={raisedAttributes.includes(attribute)}
                              onChange={() => {
                                handleAttributeToggle(attribute);
                              }}
                              name={`${attributeBonuses[attribute]}`}
                            />
                          </TableCell>
                        ))}
                        <TableCell colSpan={5}></TableCell>
                      </TableRow>
                      <LevelRow
                        level={nextLevel}
                        previousLevel={currentLevel}
                        onDeleteHandler={() => toggleIsLevelingUp()}
                      />
                    </>
                  ) : null}
                </TableBody>
                <TableFooter>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" colSpan={attributes.length + 6}>
                      {isLevelingUp ? (
                        <>
                          <LinearProgress
                            className="w-full"
                            variant="determinate"
                            color="primary"
                            value={Math.min(
                              (numMajorSkillUps /
                                NUM_MAJOR_SKILL_UPS_PER_LEVEL) *
                                100,
                              100,
                            )}
                          />
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => {
                              commitNextLevelUp();
                              toggleIsLevelingUp();
                            }}
                            className="w-full"
                            {...(numMajorSkillUps <
                              NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
                            numRaisedAttributes !== NUM_RAISED_ATTRIBUTES
                              ? { disabled: true }
                              : {})}
                          >
                            <Typography className="pt-1">Level Up</Typography>
                            <ArrowUpwardIcon />
                          </Button>
                        </>
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
      </Box>
    </ThemeProvider>
  );
}
