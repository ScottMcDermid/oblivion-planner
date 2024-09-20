"use client";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import DropDown from "@/components/DropDown";
import RadioButtons from "@/components/RadioButtons";
import SelectFromList from "@/components/SelectFromList";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import races from "@/data/races";
import type { Race } from "@/data/races";
import birthsigns from "@/data/birthsigns";
import type { Birthsign } from "@/data/birthsigns";
import attributes from "@/data/attributes";
import type { Attribute } from "@/data/attributes";
import skills from "@/data/skills";
import type { Skill } from "@/data/skills";
import specializations from "@/data/specializations";
import type { Specialization } from "@/data/specializations";
import genders from "@/data/genders";
import type { Gender } from "@/data/genders";
import baseAttributes from "@/data/baseAttributes";
import attributeRaceModifiers from "@/data/attributeRaceModifiers";

export default function Home() {
  const NUM_MAJOR_SKILLS = 7;
  const NUM_FAVORED_ATTRIBUTES = 2;

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
  const [majorSkillsError, setMajorSkillsError] = useState<string | null>(null);

  const [computedAttributes, setComputedAttributes] = useState<{
    [key in Attribute]?: number;
  }>({});

  // validation
  useEffect(() => {
    if (favoredAttributes.length !== NUM_FAVORED_ATTRIBUTES) {
      setFavoredAttributesError(
        `you must choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`,
      );
    } else {
      setFavoredAttributesError(null);
    }
  }, [favoredAttributes]);
  useEffect(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      setMajorSkillsError(
        `you must choose exactly ${NUM_MAJOR_SKILLS} major skills`,
      );
    } else {
      setMajorSkillsError(null);
    }
  }, [majorSkills]);

  useEffect(() => {
    const newAttributes: { [key in Attribute]?: number } = {};
    attributes.forEach((attribute) => {
      const modifier: number =
        attributeRaceModifiers[race][gender][attribute] ?? 0;
      newAttributes[attribute] = baseAttributes[attribute] + modifier;
    });
    setComputedAttributes(newAttributes);
  }, [race, gender, birthsign, specialization, favoredAttributes]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="p-2 font-[family-name:var(--font-geist-sans)]">
        <Box className="p-6">
          <Box className="p-2">
            <h2 className="text-3xl my-2">Character</h2>
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
          </Box>
          <Divider className="my-4" />
          <Box className="p-2">
            <h2 className="text-3xl my-2">Class</h2>
            <DropDown
              label="Birthsign"
              value={birthsign}
              options={birthsigns}
              onChangeHandler={setBirthsign as (a: string) => void}
            />
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
          <Divider className="my-4" />
          <Box className="p-2">
            <h2 className="text-3xl my-2">Leveling</h2>
            <TableContainer>
              <Table sx={{ maxWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Level</TableCell>
                    <TableCell align="right">1</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attributes.map((attribute) => (
                    <TableRow
                      key={attribute}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {attribute}
                      </TableCell>
                      <TableCell align="right">
                        {computedAttributes[attribute]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
