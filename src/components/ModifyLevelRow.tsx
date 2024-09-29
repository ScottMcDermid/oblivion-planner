import attributes, {
  attributesSetTemplate,
  getAttributeBonusFromSkillUps,
  skillsByAttribute,
} from "@/data/attributes";
import type { Attribute, AttributesSet } from "@/data/attributes";
import { Level, levelTemplate, LevelUp } from "@/types/level";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Box,
  Button,
  Checkbox,
  LinearProgress,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import SkillSelector from "./SkillSelector";
import skills, { Skill, SkillsSet, skillsSetTemplate } from "@/data/skills";
import { useEffect, useState } from "react";
import LevelRow from "./LevelRow";
import { applyLevelUpToLevel } from "@/services/Level";

export default function ModifyLevelRow({
  level,
  majorSkills,
  levelUp,
  commitLevelUpHandler,
}: {
  level: Level;
  majorSkills: Skill[];
  levelUp?: LevelUp;
  commitLevelUpHandler: (levelUp: LevelUp) => void;
}) {
  const NUM_MAJOR_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;

  const [nextLevel, setNextLevel] = useState<Level>(levelTemplate);
  const [attributeBonuses, setAttributeBonuses] = useState<AttributesSet>(
    attributesSetTemplate,
  );
  const [skillUps, setSkillUps] = useState<SkillsSet>(
    levelUp ? levelUp.skills : skillsSetTemplate,
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>(
    levelUp
      ? attributes.filter((attribute) => levelUp.attributes[attribute] > 0)
      : [],
  );
  const [numMajorSkillUps, setNumMajorSkillUps] = useState<number>(
    skills.reduce((sum, skill) => {
      if (majorSkills.includes(skill)) {
        const newSkill = skillUps[skill];
        return sum + newSkill;
      }
      return sum;
    }, 0),
  );

  const handleAttributeToggle = (value: Attribute) => {
    const currentIndex = raisedAttributes.indexOf(value);
    const newChecked = [...raisedAttributes];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

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
    setNumMajorSkillUps(
      skills.reduce((sum, skill) => {
        if (majorSkills.includes(skill)) {
          const newSkill = skillUps[skill];
          return sum + newSkill;
        }
        return sum;
      }, 0),
    );
  }, [skillUps, majorSkills]);

  useEffect(() => {
    setNextLevel(
      applyLevelUpToLevel(level, {
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
  }, [level, skillUps, raisedAttributes, attributeBonuses]);

  return (
    <>
      <TableRow>
        <TableCell className="px-0" />
        {attributes.map((attribute) => (
          <TableCell key={attribute} className="px-0">
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
                  value={level.skills[skill] + skillUps[skill]}
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

        <TableCell colSpan={4} className="hidden 2xl:table-cell px-0" />
        <TableCell />
      </TableRow>
      <TableRow>
        <TableCell className="px-0" />
        {attributes.map((attribute) => (
          <TableCell align="center" key={attribute} className="px-0">
            <Typography
              {...(raisedAttributes.includes(attribute)
                ? { color: "secondary" }
                : {})}
              className="h-full selfCenter hidden lg:show"
            >
              {`${level.attributes[attribute]} + ${attributeBonuses[attribute]}`}
            </Typography>
            <Typography
              {...(raisedAttributes.includes(attribute)
                ? { color: "secondary" }
                : {})}
              className="h-full selfCenter show lg:hidden"
            >
              {`+${attributeBonuses[attribute]}`}
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
        <TableCell colSpan={4} className="hidden 2xl:table-cell" />
        <TableCell />
      </TableRow>
      <LevelRow level={nextLevel} previousLevel={level} />
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell align="center" colSpan={attributes.length + 6}>
          <LinearProgress
            className="w-full"
            variant="determinate"
            color="primary"
            value={Math.min(
              (numMajorSkillUps / NUM_MAJOR_SKILL_UPS_PER_LEVEL) * 100,
              100,
            )}
          />
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              commitLevelUpHandler({
                skills: skillUps,
                attributes: raisedAttributes.reduce(
                  (attributes, attribute) => ({
                    ...attributes,
                    [attribute]: attributeBonuses[attribute],
                  }),
                  attributesSetTemplate,
                ),
              });
              setSkillUps(skillsSetTemplate);
              setRaisedAttributes([]);
            }}
            className="w-full"
            {...(numMajorSkillUps < NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
            raisedAttributes.length !== NUM_RAISED_ATTRIBUTES
              ? { disabled: true }
              : {})}
          >
            <Typography className="pt-1">Level Up</Typography>
            <ArrowUpwardIcon />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
