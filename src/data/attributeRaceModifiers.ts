import type { Attribute } from "@/data/attributes";
import type { Gender } from "@/data/genders";
import type { Race } from "@/data/races";

const attributeRaceModifiers: {
  [key in Race]: {
    [key in Gender]: { [key in Attribute | "Magicka"]?: number };
  };
} = {
  Altmer: {
    Male: {
      Strength: -10,
      Intelligence: 10,
      Speed: -10,
      Magicka: 100,
    },
    Female: {
      Strength: -10,
      Intelligence: 10,
      Endurance: -10,
      Magicka: 100,
    },
  },
  Argonian: {
    Male: {
      Willpower: -10,
      Agility: 10,
      Speed: 10,
      Endurance: -10,
      Personality: -10,
    },
    Female: {
      Intelligence: 10,
      Endurance: -10,
      Personality: -10,
    },
  },
  Bosmer: {
    Male: {
      Strength: -10,
      Willpower: -10,
      Agility: 10,
      Speed: 10,
      Personality: -10,
    },
    Female: {
      Strength: -10,
      Willpower: -10,
      Agility: 10,
      Speed: 10,
      Endurance: -10,
    },
  },
  Breton: {
    Male: {
      Intelligence: 10,
      Willpower: 10,
      Agility: -10,
      Speed: -10,
      Endurance: -10,
      Magicka: 50,
    },
    Female: {
      Strength: -10,
      Intelligence: 10,
      Willpower: 10,
      Agility: -10,
      Endurance: -10,
      Magicka: 50,
    },
  },
  Dunmer: {
    Male: {
      Willpower: -10,
      Speed: 10,
      Personality: -10,
    },
    Female: {
      Willpower: -10,
      Speed: 10,
      Endurance: -10,
    },
  },
  Imperial: {
    Male: {
      Agility: -10,
      Personality: 10,
      Willpower: -10,
    },
    Female: {
      Agility: -10,
      Personality: 10,
      Speed: -10,
    },
  },
  Khajiit: {
    Male: {
      Willpower: -10,
      Agility: 10,
      Endurance: -10,
    },
    Female: {
      Strength: -10,
      Willpower: -10,
      Agility: 10,
    },
  },
  Nord: {
    Male: {
      Strength: 10,
      Intelligence: -10,
      Willpower: -10,
      Endurance: 10,
      Personality: -10,
    },
    Female: {
      Strength: 10,
      Intelligence: -10,
      Personality: -10,
    },
  },
  Orc: {
    Male: {
      Strength: 5,
      Intelligence: -10,
      Willpower: 10,
      Agility: -5,
      Speed: -10,
      Endurance: 10,
      Personality: -10,
    },
    Female: {
      Strength: 5,
      Willpower: 5,
      Agility: -5,
      Speed: -10,
      Endurance: 10,
      Personality: -15,
    },
  },
  Redguard: {
    Male: {
      Strength: 10,
      Intelligence: -10,
      Willpower: -10,
      Endurance: 10,
      Personality: -10,
    },
    Female: {
      Intelligence: -10,
      Willpower: -10,
      Endurance: 10,
    },
  },
};
export default attributeRaceModifiers;
