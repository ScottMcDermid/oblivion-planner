import { useState, useEffect, ChangeEvent } from "react";
import {
  Badge,
  Box,
  IconButton,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import type { Level, LevelUp } from "@/types/level";
import skills from "@/data/skills";
import type { Skill } from "@/data/skills";
import attributes, {
  skillsByAttribute,
  getAttributeBonusFromSkillUps,
} from "@/data/attributes";
import type { Attribute, AttributesModifier } from "@/data/attributes";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function LevelUpDialog({
  currentLevel,
  majorSkills,
  handleLevelUp,
  handleClose,
}: {
  currentLevel: Level;
  majorSkills: Skill[];
  handleLevelUp: (levelUp: LevelUp) => void;
  handleClose: () => void;
}) {
  const NUM_MAJOR_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;
  const [skillUps, setSkillUps] = useState<{ [key in Skill]?: number }>(
    skills.reduce((skills, skill) => ({ ...skills, [skill]: 0 }), {}),
  );
  const [attributeBonuses, setAttributeBonuses] = useState<{
    [key in Attribute]?: number;
  }>(
    attributes.reduce(
      (attributes, attribute) => ({ ...attributes, [attribute]: 1 }),
      {},
    ),
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>([]);
  const [numMajorSkillUps, setNumMajorSkillUps] = useState<number>(0);
  const [numRaisedAttributes, setNumRaisedAttributes] = useState<number>(0);

  const handleSkillChange = (skill: Skill, value: string) => {
    const numValue: number = parseInt(value, 10);
    const newSkillValue: number = Number.isFinite(numValue) ? numValue : 0;
    setSkillUps({ ...skillUps, [skill]: newSkillValue });
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

  // compute attribute bonuses
  useEffect(() => {
    const newAttributeBonuses: AttributesModifier = attributes.reduce(
      (attributeBonuses: AttributesModifier, attribute: Attribute) => {
        const attributeSkillUps: number = skillsByAttribute[attribute].reduce(
          (sum: number, skill: Skill) => {
            return skillUps[skill] ? sum + skillUps[skill] : sum;
          },
          0,
        );
        const attributeBonus = getAttributeBonusFromSkillUps(attributeSkillUps);
        return { ...attributeBonuses, [attribute]: attributeBonus };
      },
      {},
    );
    setAttributeBonuses(newAttributeBonuses);
  }, [skillUps]);

  return (
    <Dialog open={true}>
      <DialogTitle>
        <Typography className="text-xl">
          Plan for Level {currentLevel.level + 1}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="w-full">
        <Typography className="text-xs pb-4 text-center">
          Choose 10 major skill ups and 3 attributes
        </Typography>
        {attributes.map((attribute) => (
          <Box
            key={attribute}
            className="flex flex-row content-center items-center"
          >
            {raisedAttributes.includes(attribute) &&
              currentLevel.attributes[attribute] &&
              attributeBonuses[attribute] ? (
              <Typography color="primary" className="h-full selfCenter">
                {currentLevel.attributes[attribute] +
                  attributeBonuses[attribute]}
              </Typography>
            ) : (
              <Typography>{currentLevel.attributes[attribute]}</Typography>
            )}
            <FormControl
              className="mt-4 mr-2"
              component="fieldset"
              variant="standard"
            >
              <FormGroup>
                <Badge
                  color="primary"
                  badgeContent={`+${attributeBonuses[attribute]}`}
                  invisible={!attributeBonuses[attribute]}
                >
                  <FormControlLabel
                    key={attribute}
                    label={attribute}
                    control={
                      <Checkbox
                        key={attribute}
                        checked={raisedAttributes.includes(attribute)}
                        onChange={() => {
                          handleAttributeToggle(attribute);
                        }}
                        name={`${attributeBonuses[attribute]}`}
                      />
                    }
                  />
                </Badge>
              </FormGroup>
            </FormControl>
            {skillsByAttribute[attribute].map((skill: Skill) => (
              <Box key={skill} className="max-w-24 m-2">
                {majorSkills.includes(skill) ? (
                  <TextField
                    defaultValue={skillUps[skill]}
                    label={`${skill} (Major)`}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSkillChange(skill, e.target.value)
                    }
                    type="number"
                    variant="standard"
                  />
                ) : (
                  <TextField
                    defaultValue={skillUps[skill]}
                    label={skill}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleSkillChange(skill, e.target.value)
                    }
                    type="number"
                    variant="standard"
                  />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>
      <DialogActions className="flex flex-col align-center justicy-center">
        <LinearProgress
          className="w-full ml-2"
          variant="determinate"
          color="primary"
          value={Math.min(
            (numMajorSkillUps / NUM_MAJOR_SKILL_UPS_PER_LEVEL) * 100,
            100,
          )}
        />
        <Button
          className="w-full"
          color="primary"
          {...(numMajorSkillUps < NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
            numRaisedAttributes !== NUM_RAISED_ATTRIBUTES
            ? { disabled: true }
            : {})}
          variant="outlined"
          onClick={() => {
            handleLevelUp({
              skills: skillUps,
              attributes: raisedAttributes.reduce(
                (attributes, attribute) => ({
                  ...attributes,
                  [attribute]: attributeBonuses[attribute],
                }),
                {},
              ),
            });
            handleClose();
          }}
        >
          Level up
        </Button>
      </DialogActions>
    </Dialog>
  );
}
