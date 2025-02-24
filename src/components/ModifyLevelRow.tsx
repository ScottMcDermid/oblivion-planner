import { useEffect, useMemo, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, Checkbox, LinearProgress, Typography } from '@mui/material';

import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import LevelRow from '@/components/LevelRow';

import type { Attribute, AttributesSet } from '@/utils/attributeUtils';
import type { Level, LevelUp } from '@/utils/levelUtils';

import attributes, {
  getAttributesSetTemplate,
  getAttributeBonusFromSkillUps,
  getAttributeFromSkill,
  MAX_ATTRIBUTE_LEVEL,
  skillsByAttribute,
} from '@/utils/attributeUtils';
import skills, {
  MAX_SKILL_LEVEL,
  Skill,
  SkillsSet,
  getSkillsSetTemplate,
} from '@/utils/skillUtils';
import { applyLevelUpToLevel } from '@/utils/levelUtils';
import { levelTemplate } from '@/utils/levelUtils';

import { useCharacterStore } from '@/data/characterStore';

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
    levelUp ? attributes.filter((attribute) => levelUp.attributes[attribute] > 0) : [],
  );
  const [raisedSkills, setRaisedSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState(skills[0]);
  const [showSkillFineTuner, setShowSkillFineTuner] = useState(false);

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

    setSelectedSkill(skill);
    setShowSkillFineTuner(true);
  };

  const handleSkillUnselected = (skill: Skill) => {
    const skillIndex = raisedSkills.indexOf(skill);
    if (skillIndex !== -1) {
      setRaisedSkills((raisedSkills) => {
        raisedSkills.splice(skillIndex, 1);
        return [...raisedSkills];
      });
      setShowSkillFineTuner(false);
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
    const raisedSkillsByAttribute: { [key in Attribute]?: Skill[] } = raisedSkills.reduce(
      (skills: { [key in Attribute]?: Skill[] }, skill: Skill) => {
        const attribute = getAttributeFromSkill(skill);
        skills[attribute] = skills[attribute] ? [...skills[attribute], skill] : [skill];
        return skills;
      },
      {},
    );

    const newSkillUps: SkillsSet = getSkillsSetTemplate();
    Object.keys(raisedSkillsByAttribute).map((attribute) => {
      const skills: Skill[] = raisedSkillsByAttribute[attribute as Attribute] ?? [];

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
    const newAttributeBonuses: AttributesSet = attributes.reduce((attributeBonuses, attribute) => {
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
    }, getAttributesSetTemplate());
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
      {/* padding for level column */}
      <div></div>
      {attributes.map(
        (attribute) =>
          skillsByAttribute[attribute].length > 0 && (
            <div key={attribute}>
              {skillsByAttribute[attribute].map((skill) => (
                <Box key={`${level.level}-${skill}`} className="w-full sm:w-16 lg:w-24">
                  <SkillSelector
                    skill={skill}
                    color={skillUps[skill] > 0 ? 'secondary' : skillUps[skill] < 0 ? 'error' : ''}
                    value={nextLevel.skills[skill]}
                    major={majorSkills.includes(skill)}
                    selectHandler={() => handleSkillSelected(skill)}
                    unselectHandler={() => handleSkillUnselected(skill)}
                  />
                </Box>
              ))}
            </div>
          ),
      )}

      <div className="col-span-2">
        {showSkillFineTuner && (
          <SkillFineTuner
            skill={selectedSkill}
            value={skillUps[selectedSkill]}
            onIncrement={() => {
              setSkillUps({ ...skillUps, [selectedSkill]: skillUps[selectedSkill] + 1 });
            }}
            onDecrement={() => {
              setSkillUps({ ...skillUps, [selectedSkill]: skillUps[selectedSkill] - 1 });
            }}
          />
        )}
      </div>

      {/* padding for level column */}
      <div></div>
      {attributes.map((attribute) => (
        <div key={attribute} className="px-0">
          <Typography
            {...(raisedAttributes.includes(attribute) ? { color: 'secondary' } : {})}
            className="selfCenter lg:show hidden h-full"
          >
            {`${level.attributes[attribute]} + ${attributeBonuses[attribute]}`}
          </Typography>
          <Typography
            {...(raisedAttributes.includes(attribute) ? { color: 'secondary' } : {})}
            className="selfCenter block h-full text-center"
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
        </div>
      ))}

      {/* Padding for modify level row */}
      <div></div>
      <LevelRow level={nextLevel} previousLevel={level} />

      {/* Footer */}
      <div className="2xl:col-span-14 col-span-10 w-full">
        <LinearProgress
          className="w-full"
          variant="determinate"
          color="primary"
          value={Math.min((numMajorSkillUps / NUM_MAJOR_SKILL_UPS_PER_LEVEL) * 100, 100)}
        />
        <Button
          variant="outlined"
          size="large"
          className="w-full"
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
          {...(numMajorSkillUps < NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
          raisedAttributes.length !== NUM_RAISED_ATTRIBUTES
            ? { disabled: true }
            : {})}
        >
          <ArrowUpwardIcon />
        </Button>
      </div>
    </>
  );
}
