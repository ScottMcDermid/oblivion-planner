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

import attributes, { skillsByAttribute } from '@/utils/attributeUtils';
import { diffSkillSet, getSkillsSetTemplate, sumSkillSet } from '@/utils/skillUtils';
import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import ToggleButtons from '@/components/ToggleButtons';
import ConfirmDialog from './ConfirmDialog';

export default function CharacterDialog(props: { open: boolean; handleClose: () => void }) {
  const {
    activeAbilities,
    abilityModifiers,
    actions: { setCharacterData },
  } = useCharacterStore();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [vampiricStage, setVampiricStage] = useState<VampiricStage | null>(null);

  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);

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

  const resetAbilities = (confirm: boolean) => {
    if (confirm) {
      setCharacterData({ abilityModifiers: getSkillsSetTemplate(), activeAbilities: [] });
      setVampiricStage(null);
    }
    setIsConfirmingReset(false);
  };

  const handleSkillSelected = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleSkillUnselected = (skill: Skill) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        <div className="grid w-full max-w-8xl grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
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

          <div className="w-full">
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
        <div className="mt-6 text-lg">Abilities</div>
        <div className="align-center my-4 grid grid-cols-[2rem_10rem] items-center">
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
                <div className="flex justify-start">{name}</div>
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
      <DialogActions className="space-between flex">
        <Button
          color="error"
          aria-label="Reset Abilities"
          onClick={() => {
            setIsConfirmingReset(true);
          }}
        >
          Reset
        </Button>
        <Button onClick={props.handleClose}>DONE</Button>
      </DialogActions>
      <ConfirmDialog
        open={isConfirmingReset}
        description="This will reset all abilities"
        handleClose={resetAbilities}
      />
    </Dialog>
  );
}
