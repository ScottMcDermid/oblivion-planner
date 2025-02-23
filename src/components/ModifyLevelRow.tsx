import { useEffect, useMemo, useState } from "react";
import attributes, {
  getAttributesSetTemplate,
  getAttributeBonusFromSkillUps,
  getAttributeFromSkill,
  MAX_ATTRIBUTE_LEVEL,
  skillsByAttribute,
} from "@/utils/attributeUtils";
import type { Attribute, AttributesSet } from "@/utils/attributeUtils";
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
import skills, {
  MAX_SKILL_LEVEL,
  Skill,
  SkillsSet,
  getSkillsSetTemplate,
} from "@/utils/skillUtils";
import LevelRow from "./LevelRow";
import { applyLevelUpToLevel } from "@/services/Level";
import { useCharacterStore } from "@/data/characterStore";

export default function ModifyLevelRow({
  level,
  levelUp,
  commitLevelUpHandler,
}: {
  level: Level;
  levelUp?: LevelUp;
  commitLevelUpHandler: (levelUp: LevelUp) => void;
}) {
  const { majorSkills } = useCharacterStore();
  const NUM_MAJOR_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;
  const DEFAULT_SKILL_INCREMENT = 10;

  const [nextLevel, setNextLevel] = useState<Level>(levelTemplate);
  const [attributeBonuses, setAttributeBonuses] = useState<AttributesSet>(
    getAttributesSetTemplate(),
  );
  const [skillUps, setSkillUps] = useState<SkillsSet>(
    levelUp ? levelUp.skills : getSkillsSetTemplate(),
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>(
    levelUp
      ? attributes.filter((attribute) => levelUp.attributes[attribute] > 0)
      : [],
  );
  const [raisedSkills, setRaisedSkills] = useState<Skill[]>([]);

  const numMajorSkillUps = useMemo(
    () =>
      skills.reduce((sum, skill) => {
        if (majorSkills.includes(skill)) {
          const newSkill = skillUps[skill];
          return sum + newSkill;
        }
        return sum;
      }, 0),
    [skillUps, raisedSkills, majorSkills],
  );

  const handleSkillSelected = (skill: Skill) => {
    const index = raisedSkills.indexOf(skill);
    if (index === -1) {
      setRaisedSkills((newRaisedSkills) => [...newRaisedSkills, skill]);
    }

    // check attribute associated with skill
    const attribute = getAttributeFromSkill(skill);
    if (!raisedAttributes.includes(attribute))
      setRaisedAttributes([...raisedAttributes, attribute]);
  };

  const handleSkillUnselected = (skill: Skill) => {
    const skillIndex = raisedSkills.indexOf(skill);
    if (skillIndex !== -1) {
      setRaisedSkills((raisedSkills) => {
        raisedSkills.splice(skillIndex, 1);
        return [...raisedSkills];
      });
    }

    // uncheck attribute if no skills selected
    const attribute = getAttributeFromSkill(skill);
    const skillsInAttribute = raisedSkills.filter(
      (raisedSkill) => getAttributeFromSkill(raisedSkill) === attribute,
    ).length;
    const attributeIndex = raisedAttributes.indexOf(attribute);
    if (attributeIndex !== -1 && skillsInAttribute === 0) {
      setRaisedAttributes((raisedAttributes) => {
        raisedAttributes.splice(attributeIndex, 1);
        return [...raisedAttributes];
      });
    }
  };

  useEffect(() => {
    const raisedSkillsByAttribute: { [key in Attribute]?: Skill[] } =
      raisedSkills.reduce(
        (skills: { [key in Attribute]?: Skill[] }, skill: Skill) => {
          const attribute = getAttributeFromSkill(skill);
          skills[attribute] = skills[attribute]
            ? [...skills[attribute], skill]
            : [skill];
          return skills;
        },
        {},
      );

    const newSkillUps: SkillsSet = getSkillsSetTemplate();
    Object.keys(raisedSkillsByAttribute).map((attribute) => {
      const skills: Skill[] =
        raisedSkillsByAttribute[attribute as Attribute] ?? [];

      let remainingSkillUps = DEFAULT_SKILL_INCREMENT;
      skills.map((skill, i) => {
        const pointsLeftForMaxSkill = MAX_SKILL_LEVEL - level.skills[skill];
        const increment =
          i === skills.length - 1
            ? remainingSkillUps
            : Math.floor(DEFAULT_SKILL_INCREMENT / skills.length);
        newSkillUps[skill] = Math.min(increment, pointsLeftForMaxSkill);
        remainingSkillUps -= newSkillUps[skill];
      });
    });
    setSkillUps(newSkillUps);
  }, [raisedSkills, level.skills]);

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
        const attributeBonus = getAttributeBonusFromSkillUps(
          level.attributes[attribute],
          attributeSkillUps,
        );
        return { ...attributeBonuses, [attribute]: attributeBonus };
      },
      getAttributesSetTemplate(),
    );
    setAttributeBonuses(newAttributeBonuses);
  }, [skillUps, level.attributes]);

  useEffect(() => {
    setNextLevel(
      applyLevelUpToLevel(level, {
        skills: skillUps,
        attributes: raisedAttributes.reduce(
          (attributes, attribute) => ({
            ...attributes,
            [attribute]: attributeBonuses[attribute],
          }),
          getAttributesSetTemplate(),
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
              <Box key={`${level.level}-${skill}`} className="pb-2">
                <SkillSelector
                  skill={skill}
                  color={
                    skillUps[skill] > 0
                      ? "secondary"
                      : skillUps[skill] < 0
                        ? "error"
                        : ""
                  }
                  value={nextLevel.skills[skill]}
                  major={majorSkills.includes(skill)}
                  selectHandler={() => handleSkillSelected(skill)}
                  unselectHandler={() => handleSkillUnselected(skill)}
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
              className="h-full selfCenter block lg:hidden"
            >
              {`+${attributeBonuses[attribute]}`}
            </Typography>
            <Checkbox
              key={attribute}
              color="default"
              disabled={level.attributes[attribute] >= MAX_ATTRIBUTE_LEVEL}
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
                  getAttributesSetTemplate(),
                ),
              });
              setSkillUps(getSkillsSetTemplate());
              setRaisedAttributes([]);
            }}
            className="w-full"
            {...(numMajorSkillUps < NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
            raisedAttributes.length !== NUM_RAISED_ATTRIBUTES
              ? { disabled: true }
              : {})}
          >
            <ArrowUpwardIcon />
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
