'use client';

import React, { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  abilities,
  vampiricStages,
  type VampiricStage,
  type AbilityName,
  abilityNameByVampiricStage,
  abilityModifierByVampiricStage,
} from '@/utils/abilityUtils';

import type { Skill, SkillsSet } from '@/utils/skillUtils';

import { useCharacterStore } from '@/data/characterStore';

import attributes, {
  SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS,
  skillsByAttribute,
} from '@/utils/attributeUtils';
import { diffSkillSet, MAX_SKILL_LEVEL, sumSkillSet } from '@/utils/skillUtils';
import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import ToggleButtons from '@/components/ToggleButtons';

export default function CharacterDialog(props: { open: boolean; handleClose: () => void }) {
  const {
    majorSkills,
    activeAbilities,
    abilityModifiers,
    actions: { setCharacterData },
  } = useCharacterStore();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [vampiricStage, setVampiricStage] = useState<VampiricStage | null>(null);

  function handleToggleActiveAbility(name: AbilityName) {
    const isEnabling = !activeAbilities.includes(name);
    const newActiveAbilities = isEnabling
      ? [...activeAbilities, name]
      : activeAbilities.filter((abilityName) => abilityName !== name);

    const newAbilityModifiers: SkillsSet = isEnabling
      ? sumSkillSet(abilityModifiers, abilities[name])
      : diffSkillSet(abilityModifiers, abilities[name]);

    setCharacterData({
      activeAbilities: newActiveAbilities,
      abilityModifiers: newAbilityModifiers,
    });
  }

  const handleSkillSelected = (skill: Skill) => {
    setCharacterData({
      abilityModifiers: {
        ...abilityModifiers,
        [skill]: Math.max(
          0,
          Math.min(MAX_SKILL_LEVEL - abilityModifiers[skill], SKILL_UPS_FOR_MAX_ATTRIBUTE_BONUS),
        ),
      },
    });
    setSelectedSkill(skill);
  };

  const handleSkillUnselected = (skill: Skill) => {
    setCharacterData({
      abilityModifiers: {
        ...abilityModifiers,
        [skill]: 0,
      },
    });
    setSelectedSkill(skill);
  };

  const handleSkillIncremented = (skill: Skill) => {
    setCharacterData({
      abilityModifiers: {
        ...abilityModifiers,
        [skill]: abilityModifiers[skill] + 1,
      },
    });
    setSelectedSkill(skill);
  };

  const handleSkillDecremented = (skill: Skill) => {
    setCharacterData({
      abilityModifiers: {
        ...abilityModifiers,
        [skill]: abilityModifiers[skill] - 1,
      },
    });
  };

  useEffect(() => {
    const newActiveAbilities = activeAbilities.filter(
      (ability) => !ability.startsWith('Vampirism'),
    );
    const removedAbility = activeAbilities.find(
      (ability) => !newActiveAbilities.includes(ability),
    ) as AbilityName | undefined;
    let newAbilityModifiers = removedAbility
      ? diffSkillSet(abilityModifiers, abilities[removedAbility])
      : abilityModifiers;

    if (vampiricStage) {
      newActiveAbilities.push(abilityNameByVampiricStage[vampiricStage]);
      newAbilityModifiers = sumSkillSet(
        newAbilityModifiers,
        abilityModifierByVampiricStage[vampiricStage],
      );
    }

    setCharacterData({
      activeAbilities: newActiveAbilities,
      abilityModifiers: newAbilityModifiers,
    });
  }, [vampiricStage]);

  return (
    <Dialog onClose={() => props.handleClose()} open={props.open}>
      <IconButton
        aria-label="close"
        onClick={props.handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="p-3">
        <div className="my-2 text-3xl">Abilities</div>
        <div className="my-4">Abilities modify skills without altering level progress.</div>

        <div
          className="grid w-full max-w-8xl grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
          style={{ gridAutoRows: 'minmax(3rem, auto)' }}
        >
          {attributes.map(
            (attribute) =>
              skillsByAttribute[attribute].length > 0 && (
                <div key={attribute}>
                  {skillsByAttribute[attribute].map((skill) => (
                    <Box key={skill} className="w-full sm:w-16 lg:w-24">
                      <SkillSelector
                        skill={skill}
                        color={
                          abilityModifiers[skill] > 0
                            ? 'secondary'
                            : abilityModifiers[skill] < 0
                              ? 'error'
                              : ''
                        }
                        base={0}
                        value={abilityModifiers[skill]}
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
                value={abilityModifiers[selectedSkill]}
                onIncrement={() => {
                  setCharacterData({
                    abilityModifiers: {
                      ...abilityModifiers,
                      [selectedSkill]: abilityModifiers[selectedSkill] + 1,
                    },
                  });
                }}
                onDecrement={() => {
                  setCharacterData({
                    abilityModifiers: {
                      ...abilityModifiers,
                      [selectedSkill]: abilityModifiers[selectedSkill] - 1,
                    },
                  });
                }}
              />
            )}
          </div>
        </div>

        <Divider className="my-4" />
        <div className="align-center my-4 grid grid-cols-[2rem_10rem] place-items-center">
          {Object.keys(abilities)
            .filter((name) => !name.startsWith('Vampirism'))
            .map((name) => (
              <React.Fragment key={name}>
                <Checkbox
                  checked={activeAbilities.includes(name as AbilityName)}
                  onChange={() => {
                    handleToggleActiveAbility(name as AbilityName);
                  }}
                  sx={{
                    color: 'var(--primary)',
                    '&.Mui-checked': {
                      color: 'var(--primary)',
                    },
                  }}
                />
                <div className="items-center">{name}</div>
              </React.Fragment>
            ))}
        </div>

        <div className="mt-6 text-lg">Vampirism</div>
        <ToggleButtons
          name="Vampirism"
          value={vampiricStage}
          options={vampiricStages}
          onChangeHandler={(stage) =>
            stage ? setVampiricStage(stage as VampiricStage) : setVampiricStage(null)
          }
        />
      </DialogContent>
      <DialogActions className="pull-right">
        <Button onClick={props.handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
