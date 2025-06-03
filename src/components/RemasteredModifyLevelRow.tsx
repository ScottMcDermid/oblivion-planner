import React, { useEffect, useMemo, useState } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, IconButton, LinearProgress, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Attribute, AttributesSet } from '@/utils/attributeUtils';
import type { Level, LevelUp } from '@/utils/levelUtils';

import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import RemasteredLevelRow from '@/components/RemasteredLevelRow';

import { useCharacterStore } from '@/data/characterStore';

import attributes, {
  MAX_ATTRIBUTE_LEVEL,
  NUM_VIRTUES_PER_LEVEL,
  SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS,
  VIRTUES_PER_LUCK,
  getAttributesSetTemplate,
  skillsByAttribute,
} from '@/utils/attributeUtils';
import { MAX_SKILL_LEVEL, Skill, SkillsSet, getSkillsSetTemplate } from '@/utils/skillUtils';
import { applyLevelUpToLevel, MAX_VIRTUES_PER_ATTRIBUTE } from '@/utils/levelUtils';
import AttributeSelector from '@/components/AttributeSelector';
import AttributeFineTuner from '@/components/AttributeFineTuner';

export default function RemasteredModifyLevelRow({
  level,
  levelUp,
  commitLevelUpHandler,
  onLevelUpChange,
  onCancelHandler,
}: {
  level: Level;
  levelUp?: LevelUp;
  commitLevelUpHandler: (levelUp: LevelUp) => void;
  onLevelUpChange?: (levelUp: LevelUp) => void;
  onCancelHandler?: () => void;
}) {
  const { majorSkills } = useCharacterStore();
  const NUM_RAISED_ATTRIBUTES = 3;

  const [skillUps, setSkillUps] = useState<SkillsSet>(
    levelUp ? levelUp.skills : getSkillsSetTemplate(),
  );
  const [attributeUps, setAttributeUps] = useState<AttributesSet>(
    levelUp ? levelUp.attributes : getAttributesSetTemplate(),
  );
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
  const numRaisedAttributes = useMemo(
    () =>
      Object.values(attributeUps).reduce(
        (numRaisedAttributes, modifier) =>
          modifier > 0 ? numRaisedAttributes + 1 : numRaisedAttributes,
        0,
      ),
    [attributeUps],
  );
  const virtuesConsumed = useMemo(
    () =>
      Object.entries(attributeUps).reduce(
        (virtuesConsumed, [attribute, modifier]) =>
          virtuesConsumed + modifier * (attribute === 'Luck' ? VIRTUES_PER_LUCK : 1),
        0,
      ),
    [attributeUps],
  );

  // Tracks number of attributes that have exhausted the maximum amount of virtue points allowed
  const numAttributesWithMaxedVirtues = useMemo(
    () =>
      Object.entries(attributeUps).reduce(
        (numAttributesWithMaxedVirtues, [attribute, modifier]) => {
          if (modifier > 0) {
            if (attribute === 'Luck') {
              if (modifier === 1) return numAttributesWithMaxedVirtues + 1;
            } else {
              if (modifier === MAX_VIRTUES_PER_ATTRIBUTE) return numAttributesWithMaxedVirtues + 1;
              if (level.attributes[attribute as Attribute] + modifier === MAX_ATTRIBUTE_LEVEL)
                return numAttributesWithMaxedVirtues + 1;
            }
          }
          return numAttributesWithMaxedVirtues;
        },
        0,
      ),
    [attributeUps, level],
  );

  const currentLevelUp: LevelUp = useMemo(
    () => ({
      skills: skillUps,
      attributes: attributeUps,
    }),
    [skillUps, attributeUps],
  );

  useEffect(() => {
    onLevelUpChange?.(currentLevelUp);
  }, [skillUps, attributeUps]);

  const requiredRaisedAttributes = useMemo(() => {
    const raisableAttributes = Object.values(level.attributes).filter(
      (attribute) => attribute < MAX_ATTRIBUTE_LEVEL,
    );
    return Math.min(raisableAttributes.length, NUM_RAISED_ATTRIBUTES);
  }, [level.attributes, NUM_RAISED_ATTRIBUTES]);

  const handleSkillSelected = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: Math.max(
        0,
        Math.min(MAX_SKILL_LEVEL - level.skills[skill], SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS),
      ),
    });
    setSelectedSkill(skill);
    setSelectedAttribute(null);
  };

  const handleSkillUnselected = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: 0,
    });
    setSelectedSkill(skill);
    setSelectedAttribute(null);
  };

  const handleSkillIncremented = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: skillUps[skill] + 1,
    });
    setSelectedSkill(skill);
    setSelectedAttribute(null);
  };

  const handleSkillDecremented = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: skillUps[skill] - 1,
    });
    setSelectedSkill(skill);
    setSelectedAttribute(null);
  };

  const handleAttributeSelected = (attribute: Attribute) => {
    setAttributeUps({
      ...attributeUps,
      [attribute]:
        attribute === 'Luck'
          ? Math.max(0, Math.min(MAX_ATTRIBUTE_LEVEL - level.attributes[attribute], 1))
          : Math.max(
              0,
              Math.min(
                MAX_ATTRIBUTE_LEVEL - level.attributes[attribute],
                MAX_VIRTUES_PER_ATTRIBUTE,
              ),
            ),
    });
    setSelectedSkill(null);
    setSelectedAttribute(attribute);
  };
  const handleAttributeUnselected = (attribute: Attribute) => {
    setAttributeUps({
      ...attributeUps,
      [attribute]: 0,
    });
    setSelectedSkill(null);
    setSelectedAttribute(attribute);
  };

  const handleAttributeIncremented = (attribute: Attribute) => {
    setAttributeUps({
      ...attributeUps,
      [attribute]: attributeUps[attribute] + 1,
    });
    setSelectedSkill(null);
    setSelectedAttribute(attribute);
  };
  const handleAttributeDecremented = (attribute: Attribute) => {
    setAttributeUps({
      ...attributeUps,
      [attribute]: attributeUps[attribute] - 1,
    });
    setSelectedSkill(null);
    setSelectedAttribute(attribute);
  };

  // compute attribute bonuses
  const nextLevel = useMemo(
    () =>
      applyLevelUpToLevel(
        level,
        {
          skills: skillUps,
          attributes: attributeUps,
        },
        true,
      ),
    [level, skillUps, attributeUps],
  );

  const canLevelUp = useMemo(
    () =>
      numRaisedAttributes === requiredRaisedAttributes &&
      (virtuesConsumed === NUM_VIRTUES_PER_LEVEL ||
        (virtuesConsumed <= NUM_VIRTUES_PER_LEVEL &&
          numAttributesWithMaxedVirtues === requiredRaisedAttributes)),
    [numRaisedAttributes, virtuesConsumed, numAttributesWithMaxedVirtues, requiredRaisedAttributes],
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
        {selectedAttribute && (
          <AttributeFineTuner
            className="lg:hidden"
            attribute={selectedAttribute}
            max={
              selectedAttribute === 'Luck'
                ? Math.min(MAX_ATTRIBUTE_LEVEL - level.attributes[selectedAttribute], 1)
                : Math.min(
                    MAX_ATTRIBUTE_LEVEL - level.attributes[selectedAttribute],
                    MAX_VIRTUES_PER_ATTRIBUTE,
                  )
            }
            min={0}
            value={attributeUps[selectedAttribute]}
            onIncrement={() => {
              setAttributeUps({
                ...attributeUps,
                [selectedAttribute]: attributeUps[selectedAttribute] + 1,
              });
            }}
            onDecrement={() => {
              setAttributeUps({
                ...attributeUps,
                [selectedAttribute]: attributeUps[selectedAttribute] - 1,
              });
            }}
          />
        )}
      </div>

      {/* Padding for level column */}
      <div>Virtues</div>
      {attributes.map((attribute) => (
        <div key={attribute} className="px-0">
          <AttributeSelector
            attribute={attribute}
            color={
              attributeUps[attribute] > 0 ? 'secondary' : attributeUps[attribute] < 0 ? 'error' : ''
            }
            base={level.attributes[attribute]}
            maxIncrease={attribute === 'Luck' ? 1 : MAX_VIRTUES_PER_ATTRIBUTE}
            value={nextLevel.attributes[attribute]}
            selectHandler={() => handleAttributeSelected(attribute)}
            unselectHandler={() => handleAttributeUnselected(attribute)}
            incrementHandler={() => handleAttributeIncremented(attribute)}
            decrementHandler={() => handleAttributeDecremented(attribute)}
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
      <RemasteredLevelRow level={nextLevel} previousLevel={level} />

      {/* Footer */}
      <div className="col-span-full w-full">
        <LinearProgress
          className="w-full"
          variant="determinate"
          color="primary"
          value={Math.min((virtuesConsumed / NUM_VIRTUES_PER_LEVEL) * 100, 100)}
        />
        <Button
          variant="outlined"
          size="large"
          className="w-full"
          onClick={() => {
            commitLevelUpHandler({
              skills: skillUps,
              attributes: attributeUps,
            });
            setSkillUps(getSkillsSetTemplate());
            setAttributeUps(getAttributesSetTemplate());
            setSelectedSkill(null);
            setSelectedAttribute(null);
          }}
          {...(!canLevelUp ? { disabled: true } : {})}
        >
          <ArrowUpwardIcon /> <span className="pt-1">Level Up</span>
        </Button>
        <div className="w-full py-2 text-center text-xs text-ghost">
          {virtuesConsumed}/{NUM_VIRTUES_PER_LEVEL} virtues and {numRaisedAttributes}/
          {requiredRaisedAttributes} raised attributes
        </div>
      </div>
    </>
  );
}
