'use client';

import React, { useMemo } from 'react';
import Divider from '@mui/material/Divider';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Attribute } from '@/utils/attributeUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Gender, LocationOrigin } from '@/utils/genderUtils';
import type { Race } from '@/utils/raceUtils';
import type { Skill } from '@/utils/skillUtils';
import type { Specialization } from '@/utils/specializationUtils';

import DropDown from '@/components/DropDown';

import { useCharacterStore } from '@/data/characterStore';

import attributes, {
  skillsByAttribute,
  NUM_FAVORED_ATTRIBUTES,
  shorthandByAttribute,
} from '@/utils/attributeUtils';
import specializations from '@/utils/specializationUtils';
import races, { locationOriginByRaceAndGender, locationOriginsByRace } from '@/utils/raceUtils';
import genders, { genderByLocationOrigin } from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import { NUM_MAJOR_SKILLS, shorthandBySkill } from '@/utils/skillUtils';
import ToggleButtons from '@/components/ToggleButtons';

export default function CharacterDialog(props: {
  open: boolean;
  remastered: boolean;
  handleClose: () => void;
}) {
  const {
    race,
    gender,
    birthsign,
    specialization,
    favoredAttributes,
    majorSkills,
    actions: { setCharacterData },
  } = useCharacterStore();

  const favoredAttributesError = useMemo(() => {
    if (favoredAttributes.length !== NUM_FAVORED_ATTRIBUTES) {
      return `Choose exactly ${NUM_FAVORED_ATTRIBUTES} favored attributes`;
    } else {
      return '';
    }
  }, [favoredAttributes]);
  const majorSkillsError = useMemo(() => {
    if (majorSkills.length !== NUM_MAJOR_SKILLS) {
      return `Choose exactly ${NUM_MAJOR_SKILLS} major skills`;
    } else {
      return '';
    }
  }, [majorSkills]);

  const handleToggleFavoredAttribute = (attribute: Attribute) => {
    const currentIndex = favoredAttributes.indexOf(attribute);
    const newFavoredAttributes = [...favoredAttributes];

    if (currentIndex === -1) {
      newFavoredAttributes.push(attribute);
    } else {
      newFavoredAttributes.splice(currentIndex, 1);
    }
    setCharacterData({
      favoredAttributes: newFavoredAttributes,
    });
  };

  const handleToggleMajorSkill = (skill: Skill) => {
    const currentIndex = majorSkills.indexOf(skill);
    const newMajorSkills = [...majorSkills];

    if (currentIndex === -1) {
      newMajorSkills.push(skill);
    } else {
      newMajorSkills.splice(currentIndex, 1);
    }
    setCharacterData({
      majorSkills: newMajorSkills,
    });
  };

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
        <div className="my-2 text-3xl">Character</div>
        <DropDown
          label="Race"
          value={race}
          options={races}
          onChangeHandler={(race) => setCharacterData({ race: race as Race })}
        />
        {props.remastered ? (
          <ToggleButtons
            name="Location Origin"
            value={locationOriginByRaceAndGender[race][gender]}
            options={locationOriginsByRace[race]}
            onChangeHandler={(locationOrigin) =>
              setCharacterData({ gender: genderByLocationOrigin[locationOrigin as LocationOrigin] })
            }
          />
        ) : (
          <ToggleButtons
            name="Gender"
            value={gender}
            options={genders}
            onChangeHandler={(gender) => setCharacterData({ gender: gender as Gender })}
          />
        )}

        <DropDown
          label="Birthsign"
          value={birthsign}
          options={birthsigns}
          onChangeHandler={(birthsign) => setCharacterData({ birthsign: birthsign as Birthsign })}
        />
        <Divider className="my-4" />
        <div className="my-2 text-3xl">Class</div>
        <ToggleButtons
          label="Specialization"
          name="Specialization"
          value={specialization}
          options={specializations}
          onChangeHandler={(specialization) =>
            setCharacterData({
              specialization: specialization as Specialization,
            })
          }
        />
        <div className="mt-6 text-xs">Choose 2 favored attributes and 7 major skills</div>
        <div className="my-4 grid grid-cols-[3rem_1fr_3fr] place-items-center lg:grid-cols-[6rem_1fr_3fr]">
          <div></div>
          <div className="text-lg">Favored</div>
          <div className="text-lg">Skills</div>
          {attributes.map((attribute) => (
            <React.Fragment key={attribute}>
              <div className="mt-1 w-full text-right">
                <span className="inline lg:hidden">{shorthandByAttribute[attribute]}</span>
                <span className="hidden lg:inline">{attribute}</span>
              </div>
              <Checkbox
                checked={favoredAttributes.includes(attribute)}
                onChange={() => {
                  handleToggleFavoredAttribute(attribute);
                }}
                sx={{
                  color: 'var(--primary)',
                  '&.Mui-checked': {
                    color: 'var(--primary)',
                  },
                }}
              />
              <ToggleButtonGroup value={majorSkills}>
                {skillsByAttribute[attribute].map((skill) => (
                  <ToggleButton
                    key={skill}
                    className="min-w-14 py-1 sm:min-w-32"
                    value={skill}
                    onChange={() => handleToggleMajorSkill(skill)}
                  >
                    <span className="hidden sm:inline">{skill}</span>
                    <span className="sm:hidden">{shorthandBySkill[skill]}</span>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </React.Fragment>
          ))}
        </div>
        <div className="h-6 text-xs text-error">
          <span>{favoredAttributesError}</span>
          {!favoredAttributesError && <span>{majorSkillsError}</span>}
        </div>
      </DialogContent>
      <DialogActions className="pull-right">
        <Button onClick={props.handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
