import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  LinearProgress,
  Typography,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import type { Level, LevelUp } from "@/types/level";
import skills, { skillsSetTemplate } from "@/data/skills";
import type { Skill, SkillsSet } from "@/data/skills";
import attributes, {
  skillsByAttribute,
  attributesSetTemplate,
  getAttributeBonusFromSkillUps,
} from "@/data/attributes";
import type { Attribute, AttributesSet } from "@/data/attributes";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import SkillSelector from "@/components/SkillSelector";

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
  const [skillUps, setSkillUps] = useState<SkillsSet>(
    skills.reduce(
      (skills, skill) => ({ ...skills, [skill]: 0 }),
      skillsSetTemplate,
    ),
  );
  const [attributeBonuses, setAttributeBonuses] = useState<AttributesSet>(
    attributes.reduce(
      (attributes, attribute) => ({ ...attributes, [attribute]: 1 }),
      attributesSetTemplate,
    ),
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>([]);
  const [numMajorSkillUps, setNumMajorSkillUps] = useState<number>(0);
  const [numRaisedAttributes, setNumRaisedAttributes] = useState<number>(0);

  const handleSkillChange = (skill: Skill, value: number) => {
    setSkillUps({ ...skillUps, [skill]: value });
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
    const numMajorSkillUps = skills.reduce((sum, skill) => {
      if (majorSkills.includes(skill)) {
        const newSkill = skillUps[skill];
        return sum + newSkill;
      }
      return sum;
    }, 0);
    setNumMajorSkillUps(numMajorSkillUps);
  }, [skillUps, majorSkills]);

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

  return (
    <Dialog open={true}>
      <DialogTitle className="flex flex-col text-center">
        <Typography className="text-lg text-center">
          Choose 10 major skill ups and 3 attributes
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
        {attributes.map((attribute) => (
          <Box key={attribute}>
            <Box className="flex flex-row content-center items-center py-2">
              <Box className="flex flex-row content-center items-center flex-grow">
                {skillsByAttribute[attribute].map((skill: Skill) => (
                  <SkillSelector
                    key={skill}
                    skill={skill}
                    color={
                      skillUps[skill] > 0
                        ? "secondary"
                        : skillUps[skill] < 0
                          ? "error"
                          : ""
                    }
                    value={currentLevel.skills[skill] + skillUps[skill]}
                    major={majorSkills.includes(skill)}
                    onChangeHandler={(newValue) =>
                      handleSkillChange(skill, newValue)
                    }
                  />
                ))}
              </Box>

              <Box className="px-4">
                <ChevronRightIcon />
              </Box>

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
            </Box>
            <Divider />
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
                attributesSetTemplate,
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
