import { create } from "zustand";

import type { Race } from "@/utils/raceUtils";
import type { Gender } from "@/utils/genderUtils";
import type { Birthsign } from "@/utils/birthsignUtils";
import type { Specialization } from "@/utils/specializationUtils";
import type { Attribute } from "@/utils/attributeUtils";
import type { Skill } from "@/utils/skillUtils";

import races from "@/utils/raceUtils";
import genders from "@/utils/genderUtils";
import birthsigns from "@/utils/birthsignUtils";
import specializations from "@/utils/specializationUtils";
import attributes, { NUM_FAVORED_ATTRIBUTES } from "@/utils/attributeUtils";
import skills, { NUM_MAJOR_SKILLS } from "@/utils/skillUtils";

type State = {
  race: Race;
  gender: Gender;
  birthsign: Birthsign;
  specialization: Specialization;
  favoredAttributes: Attribute[];
  majorSkills: Skill[];
};

type Action = { setCharacterData: (state: Partial<State>) => void };

type CharacterStore = State & { actions: Action };

const useCharacterStore = create<CharacterStore>((set) => {
  return {
    race: races[0],
    gender: genders[0],
    birthsign: birthsigns[0],
    specialization: specializations[0],
    favoredAttributes: attributes.slice(0, NUM_FAVORED_ATTRIBUTES),
    majorSkills: skills.slice(0, NUM_MAJOR_SKILLS),
    actions: {
      setCharacterData: (state: Partial<State>) => set(() => ({ ...state })),
    },
  };
});

export { useCharacterStore };
