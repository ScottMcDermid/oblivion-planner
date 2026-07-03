'use client';

import React, { useMemo } from 'react';
import Divider from '@mui/material/Divider';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
import SkillIcon from '@/components/SkillIcon';

export const CHARACTER_DRAWER_WIDTH = 420;

function CharacterContent({
  remastered,
}: {
  remastered: boolean;
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
    <>
      <div className="my-2 text-3xl">Character</div>
      <DropDown
        label="Race"
        value={race}
        options={races}
        onChangeHandler={(race) => setCharacterData({ race: race as Race })}
      />
      {remastered ? (
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
      <div className="my-4 grid grid-cols-[3rem_1fr_3fr] place-items-center">
        <div></div>
        <div className="text-lg">Favored</div>
        <div className="text-lg">Skills</div>
        {attributes.map((attribute) => (
          <React.Fragment key={attribute}>
            <div className="mt-1 w-full text-right">
              {shorthandByAttribute[attribute]}
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
            <ToggleButtonGroup value={majorSkills} sx={{ flexWrap: 'wrap' }}>
              {skillsByAttribute[attribute].map((skill) => (
                <ToggleButton
                  key={skill}
                  className="min-w-14 py-1 sm:min-w-32 lg:min-w-14"
                  value={skill}
                  onChange={() => handleToggleMajorSkill(skill)}
                >
                  <SkillIcon skill={skill} size={14} style={{ marginRight: 4 }} />
                  <span className="hidden sm:inline lg:hidden">{skill}</span>
                  <span className="sm:hidden lg:inline">{shorthandBySkill[skill]}</span>
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
    </>
  );
}

export default function CharacterDialog(props: {
  open: boolean;
  remastered: boolean;
  handleClose: () => void;
}) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  if (isLargeScreen) {
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={props.open}
        sx={{
          width: props.open ? CHARACTER_DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: CHARACTER_DRAWER_WIDTH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <div className="flex items-center justify-end p-2">
          <IconButton aria-label="close" onClick={props.handleClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-3">
          <CharacterContent remastered={props.remastered} />
        </div>
      </Drawer>
    );
  }

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
        <CharacterContent remastered={props.remastered} />
      </DialogContent>
      <DialogActions className="pull-right">
        <Button onClick={props.handleClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
