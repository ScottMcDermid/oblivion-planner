import React, { useMemo, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Attribute, AttributesSet } from '@/utils/attributeUtils';
import type { Level, LevelUp } from '@/utils/levelUtils';

import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import LevelRow from '@/components/LevelRow';

import { useCharacterStore } from '@/data/characterStore';

import attributes, {
  MAX_ATTRIBUTE_LEVEL,
  SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS,
  getAttributeBonusFromSkillUps,
  getAttributeFromSkill,
  getAttributesSetTemplate,
  skillsByAttribute,
} from '@/utils/attributeUtils';
import skills, {
  MAX_SKILL_LEVEL,
  Skill,
  SkillsSet,
  getSkillsSetTemplate,
} from '@/utils/skillUtils';
import { applyLevelUpToLevel } from '@/utils/levelUtils';

export default function ModifyLevelRow({
  level,
  levelUp,
  commitLevelUpHandler,
  onCancelHandler,
}: {
  level: Level;
  levelUp?: LevelUp;
  commitLevelUpHandler: (levelUp: LevelUp) => void;
  onCancelHandler?: () => void;
}) {
  const { majorSkills } = useCharacterStore();
  const NUM_MAJOR_SKILL_UPS_PER_LEVEL = 10;
  const NUM_RAISED_ATTRIBUTES = 3;

  const [skillUps, setSkillUps] = useState<SkillsSet>(
    levelUp ? levelUp.skills : getSkillsSetTemplate(),
  );
  const [raisedAttributes, setRaisedAttributes] = useState<Attribute[]>(
    levelUp ? attributes.filter((attribute) => levelUp.attributes[attribute] > 0) : [],
  );
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const numMajorSkillUps = useMemo(
    () =>
      skills.reduce((sum, skill) => {
        if (majorSkills.includes(skill)) {
          const newSkill = skillUps[skill];
          return sum + newSkill;
        }
        return sum;
      }, 0),
    [skillUps, majorSkills],
  );

  const handleSkillSelected = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: Math.max(
        0,
        Math.min(MAX_SKILL_LEVEL - level.skills[skill], SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS),
      ),
    });
    const attribute = getAttributeFromSkill(skill);

    // automatically select attribute if associated skill is selected
    if (
      !raisedAttributes.includes(attribute) &&
      level.attributes[attribute] < MAX_ATTRIBUTE_LEVEL
    ) {
      setRaisedAttributes([...raisedAttributes, attribute]);
    }
    setSelectedSkill(skill);
  };

  const handleSkillUnselected = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: 0,
    });

    // uncheck attribute if last skill is unchecked
    const attribute = getAttributeFromSkill(skill);
    const attributeSkills = Object.entries(skillUps).find(
      ([s, level]) => skill !== s && level > 0 && getAttributeFromSkill(s as Skill) === attribute,
    );
    if (!attributeSkills) {
      setRaisedAttributes(raisedAttributes.slice(0).filter((a) => a !== attribute));
    }
    setSelectedSkill(skill);
  };

  const handleSkillIncremented = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: skillUps[skill] + 1,
    });

    // uncheck attribute if last skill is unchecked
    const attribute = getAttributeFromSkill(skill);
    const attributeSkills = Object.entries(skillUps).find(
      ([s, level]) => skill !== s && level > 0 && getAttributeFromSkill(s as Skill) === attribute,
    );
    if (!attributeSkills) {
      setRaisedAttributes(raisedAttributes.slice(0).filter((a) => a !== attribute));
    }
    setSelectedSkill(skill);
  };

  const handleSkillDecremented = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: skillUps[skill] - 1,
    });

    // uncheck attribute if last skill is unchecked
    const attribute = getAttributeFromSkill(skill);
    const attributeSkills = Object.entries(skillUps).find(
      ([s, level]) => skill !== s && level > 0 && getAttributeFromSkill(s as Skill) === attribute,
    );
    if (!attributeSkills) {
      setRaisedAttributes(raisedAttributes.slice(0).filter((a) => a !== attribute));
    }
    setSelectedSkill(skill);
  };

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
  const attributeBonuses: AttributesSet = useMemo(
    () =>
      attributes.reduce((bonuses, attribute) => {
        const attributeSkillUps = skillsByAttribute[attribute].reduce(
          (sum: number, skill: Skill) => {
            return sum + skillUps[skill];
          },
          0,
        );
        const attributeBonus = getAttributeBonusFromSkillUps(
          level.attributes[attribute],
          attributeSkillUps,
        );
        return { ...bonuses, [attribute]: attributeBonus };
      }, getAttributesSetTemplate()),
    [skillUps, level.attributes],
  );

  const nextLevel = useMemo(
    () =>
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
    [level, skillUps, raisedAttributes, attributeBonuses],
  );

  const requiredRaisedAttributes = useMemo(() => {
    const raisableAttributes = Object.values(level.attributes).filter(
      (attribute) => attribute < MAX_ATTRIBUTE_LEVEL,
    );
    return Math.min(raisableAttributes.length, NUM_RAISED_ATTRIBUTES);
  }, [level.attributes, NUM_RAISED_ATTRIBUTES]);

  const canLevelUp = useMemo(
    () =>
      numMajorSkillUps !== NUM_MAJOR_SKILL_UPS_PER_LEVEL ||
      raisedAttributes.length !== requiredRaisedAttributes,
    [numMajorSkillUps, raisedAttributes],
  );

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
                    base={level.skills[skill]}
                    value={nextLevel.skills[skill]}
                    major={majorSkills.includes(skill)}
                    selectHandler={() => handleSkillSelected(skill)}
                    unselectHandler={() => handleSkillUnselected(skill)}
                    incrementHandler={() => handleSkillIncremented(skill)}
                    decrementHandler={() => handleSkillDecremented(skill)}
                  />
                </Box>
              ))}
            </div>
          ),
      )}

      <div className="col-span-2 w-full justify-start xl:col-span-6">
        {selectedSkill && (
          <SkillFineTuner
            className="lg:hidden"
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

      {/* Padding for level column */}
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
            color="primary"
            key={attribute}
            disabled={level.attributes[attribute] >= MAX_ATTRIBUTE_LEVEL}
            checked={raisedAttributes.includes(attribute)}
            onChange={() => {
              handleAttributeToggle(attribute);
            }}
            name={`${attributeBonuses[attribute]}`}
            sx={{
              color: 'var(--primary)',
              '&.Mui-checked': {
                color: 'var(--primary)',
              },
            }}
          />
        </div>
      ))}

      {/* Padding for modify level row */}
      <div className="xl:col-span-5">
        {onCancelHandler ? (
          <Tooltip title="Cancel">
            <IconButton
              className="p-0 px-1"
              aria-label="Cancel"
              onClick={() => onCancelHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <LevelRow level={nextLevel} previousLevel={level} />

      {/* Footer */}
      <div className="col-span-full w-full">
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
            setSelectedSkill(null);
          }}
          {...(canLevelUp ? { disabled: true } : {})}
        >
          <ArrowUpwardIcon /> <span className="pt-1">Level Up</span>
        </Button>
        <div className="w-full py-2 text-center text-xs text-ghost">
          {numMajorSkillUps}/10 major skill ups and {raisedAttributes.length}/3 raised attributes
        </div>
      </div>
    </>
  );
}
