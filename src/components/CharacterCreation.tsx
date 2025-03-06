'use client';

import React, { useMemo } from 'react';
import Divider from '@mui/material/Divider';
import { Drawer } from '@mui/material';

import type { Race } from '@/utils/raceUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Specialization } from '@/utils/specializationUtils';

import DropDown from '@/components/DropDown';
import SelectFromList from '@/components/SelectFromList';

import { useCharacterStore } from '@/data/characterStore';

import attributes, { Attribute, NUM_FAVORED_ATTRIBUTES } from '@/utils/attributeUtils';
import specializations from '@/utils/specializationUtils';
import races from '@/utils/raceUtils';
import genders from '@/utils/genderUtils';
import birthsigns from '@/utils/birthsignUtils';
import skills, { NUM_MAJOR_SKILLS } from '@/utils/skillUtils';
import { Skill } from '@/utils/skillUtils';
import ToggleButtons from '@/components/ToggleButtons';

export default function CharacterCreation(props: {
  open: boolean;

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

  return (
    <Drawer onClose={() => props.handleClose()} open={props.open} anchor="left">
      <div className="p-3">
        <div className="my-2 text-3xl">Character</div>
        <DropDown
          label="Race"
          value={race}
          options={races}
          onChangeHandler={(race) => setCharacterData({ race: race as Race })}
        />
        <ToggleButtons
          name="Gender"
          value={gender}
          options={genders}
          onChangeHandler={(gender) => setCharacterData({ gender: gender as Gender })}
        />
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
        <SelectFromList
          label="Favored Attributes"
          selectedOptions={favoredAttributes}
          error={favoredAttributesError}
          onChangeHandler={(favoredAttributes) =>
            setCharacterData({
              favoredAttributes: favoredAttributes as Attribute[],
            })
          }
          options={attributes}
        />
        <SelectFromList
          label="Major Skills"
          selectedOptions={majorSkills}
          error={majorSkillsError}
          onChangeHandler={(majorSkills) =>
            setCharacterData({ majorSkills: majorSkills as Skill[] })
          }
          options={skills}
        />
      </div>
    </Drawer>
  );
}
