import { useState, useEffect, ChangeEvent } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  LinearProgress,
  TextField,
} from "@mui/material";

import SelectFromList from "@/components/SelectFromList";
import type { Level, LevelUp } from "@/types/level";
import skills from "@/data/skills";
import type { Skill } from "@/data/skills";
import { attributeCodes } from "@/data/attributes";
import type { AttributeCode } from "@/data/attributes";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function LevelUpDialog({
  currentLevel,
  majorSkills,
  handleLevelUp,
}: {
  currentLevel: Level;
  majorSkills: Skill[];
  handleLevelUp: (levelUp: LevelUp) => void;
}) {
  const NUM_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;
  const [skillUps, setSkillUps] = useState<{ [key in Skill]?: number }>(
    skills.reduce((skills, skill) => ({ ...skills, [skill]: 0 }), {}),
  );
  const [attributeBonuses, setAttributeBonuses] = useState<{
    [key in AttributeCode]?: number;
  }>(
    attributeCodes.reduce(
      (attributes, attribute) => ({ ...attributes, [attribute]: 0 }),
      {},
    ),
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>([]);
  const [raisedAttributesError, setRaisedAttributesError] =
    useState<string>("");
  const [numMajorSkillUps, setNumMajorSkillUps] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(true);

  const handleSkillChange = function (skill: Skill, value: string) {
    const numValue: number = parseInt(value, 10);
    const newSkillValue: number = Number.isFinite(numValue) ? numValue : 0;
    setSkillUps({ ...skillUps, [skill]: newSkillValue });
  };

  useEffect(() => {
    const newNumSkillUps = Object.keys(skillUps).reduce((sum, skill) => {
      if (majorSkills.includes(skill as Skill)) {
        const newSkill = skillUps[skill as Skill] ?? 0;
        return sum + newSkill;
      }
      return sum;
    }, 0);
    setNumMajorSkillUps(newNumSkillUps);
  }, [skillUps, majorSkills]);

  useEffect(() => {
    const newNumSkillUps = Object.keys(skillUps).reduce((sum, skill) => {
      const newSkill = skillUps[skill as Skill] ?? 0;
      return sum + newSkill;
      return sum;
    }, 0);
    setNumMajorSkillUps(newNumSkillUps);
  }, [skillUps]);

  // validation
  useEffect(() => {
    console.log(raisedAttributes.length);
    if (raisedAttributes.length !== NUM_RAISED_ATTRIBUTES) {
      setRaisedAttributesError(
        `you must choose exactly ${NUM_RAISED_ATTRIBUTES} attributes`,
      );
    } else {
      setRaisedAttributesError("");
    }
  }, [raisedAttributes]);

  return (
    <Dialog open={open}>
      <DialogTitle>
        <h2 className="mb-2">Plan for Level {currentLevel.level + 1}</h2>
        <LinearProgress
          className="w-full"
          variant="determinate"
          value={Math.min(
            (numMajorSkillUps / NUM_SKILL_UPS_PER_LEVEL) * 100,
            100,
          )}
        />
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-row">
          <Box className="p-2 grid grid-cols-1">
            <h2 className="text-lg my-2">Skill Ups</h2>
            {skills.map((skill) =>
              majorSkills.includes(skill) ? (
                <TextField
                  className="m-2 w-24"
                  defaultValue={skillUps[skill]}
                  key={skill}
                  label={`${skill} (Major)`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSkillChange(skill, e.target.value)
                  }
                  type="number"
                  variant="standard"
                />
              ) : (
                <TextField
                  className="m-2 w-24"
                  defaultValue={skillUps[skill]}
                  key={skill}
                  label={skill}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSkillChange(skill, e.target.value)
                  }
                  type="number"
                  variant="standard"
                />
              ),
            )}
          </Box>
          <Box className="p-2 flex-grow min-w-64">
            <SelectFromList
              label="Attributes"
              selectedOptions={raisedAttributes}
              error={raisedAttributesError}
              onChangeHandler={setRaisedAttributes as (a: string[]) => void}
              options={attributeCodes}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          className="w-full"
          variant="outlined"
          onClick={() => {
            handleLevelUp({
              skills: skillUps,
              attributes: raisedAttributes,
            });
            setOpen(false);
          }}
        >
          Level up
        </Button>
      </DialogActions>
    </Dialog>
  );
}
