import type { AttributesModifier } from "@/data/attributes";
import type { Gender } from "@/data/genders";
import { SkillsModifier } from "@/data/skills";

export type RaceModifier = {
  magicka?: number;
  skills: SkillsModifier;
  attributes: { [key in Gender]: AttributesModifier };
};

export const raceModifiers: {
  [key in Race]: RaceModifier;
} = {
  Altmer: {
    attributes: {
      Male: {
        STR: -10,
        INT: 10,
        SPD: -10,
      },
      Female: {
        STR: -10,
        INT: 10,
        END: -10,
      },
    },
    magicka: 100,
    skills: {
      Alchemy: 5,
      Alteration: 10,
      Conjuration: 5,
      Destruction: 10,
      Illusion: 5,
      Mysticism: 10,
    },
  },
  Argonian: {
    attributes: {
      Male: {
        WIL: -10,
        AGL: 10,
        SPD: 10,
        END: -10,
        PER: -10,
      },
      Female: {
        INT: 10,
        END: -10,
        PER: -10,
      },
    },
    skills: {
      Alchemy: 5,
      Athletics: 10,
      Blade: 5,
      "Hand-to-Hand": 5,
      Illusion: 5,
      Mysticism: 5,
      Security: 10,
    },
  },
  Bosmer: {
    attributes: {
      Male: {
        STR: -10,
        WIL: -10,
        AGL: 10,
        SPD: 10,
        PER: -10,
      },
      Female: {
        STR: -10,
        WIL: -10,
        AGL: 10,
        SPD: 10,
        END: -10,
      },
    },
    skills: {
      Acrobatics: 5,
      Alchemy: 10,
      Alteration: 5,
      "Light Armor": 5,
      Marksmanship: 10,
      Sneak: 10,
    },
  },
  Breton: {
    attributes: {
      Male: {
        INT: 10,
        WIL: 10,
        AGL: -10,
        SPD: -10,
        END: -10,
      },
      Female: {
        STR: -10,
        INT: 10,
        WIL: 10,
        AGL: -10,
        END: -10,
      },
    },
    magicka: 50,
    skills: {
      Alchemy: 5,
      Alteration: 5,
      Conjuration: 10,
      Illusion: 5,
      Mysticism: 10,
      Restoration: 10,
    },
  },
  Dunmer: {
    attributes: {
      Male: {
        WIL: -10,
        SPD: 10,
        PER: -10,
      },
      Female: {
        WIL: -10,
        SPD: 10,
        END: -10,
      },
    },
    skills: {
      Athletics: 5,
      Blade: 10,
      Blunt: 5,
      Destruction: 10,
      "Light Armor": 5,
      Marksmanship: 5,
      Mysticism: 5,
    },
  },
  Imperial: {
    attributes: {
      Male: {
        AGL: -10,
        PER: 10,
        WIL: -10,
      },
      Female: {
        AGL: -10,
        PER: 10,
        SPD: -10,
      },
    },
    skills: {
      Blade: 5,
      Blunt: 5,
      "Hand-to-Hand": 5,
      "Heavy Armor": 10,
      Mercantile: 10,
      Speechcraft: 10,
    },
  },
  Khajiit: {
    attributes: {
      Male: {
        WIL: -10,
        AGL: 10,
        END: -10,
      },
      Female: {
        STR: -10,
        WIL: -10,
        AGL: 10,
      },
    },
    skills: {
      Acrobatics: 10,
      Athletics: 5,
      Blade: 5,
      "Hand-to-Hand": 10,
      "Light Armor": 5,
      Security: 5,
      Sneak: 5,
    },
  },
  Nord: {
    attributes: {
      Male: {
        STR: 10,
        INT: -10,
        WIL: -10,
        END: 10,
        PER: -10,
      },
      Female: {
        STR: 10,
        INT: -10,
        PER: -10,
      },
    },
    skills: {
      Armorer: 5,
      Blade: 10,
      Block: 5,
      Blunt: 10,
      "Heavy Armor": 10,
      Restoration: 5,
    },
  },
  Orc: {
    attributes: {
      Male: {
        STR: 5,
        INT: -10,
        WIL: 10,
        AGL: -5,
        SPD: -10,
        END: 10,
        PER: -10,
      },
      Female: {
        STR: 5,
        WIL: 5,
        AGL: -5,
        SPD: -10,
        END: 10,
        PER: -15,
      },
    },
    skills: {
      Armorer: 10,
      Block: 10,
      Blunt: 10,
      "Hand-to-Hand": 5,
      "Heavy Armor": 10,
    },
  },
  Redguard: {
    attributes: {
      Male: {
        STR: 10,
        INT: -10,
        WIL: -10,
        END: 10,
        PER: -10,
      },
      Female: {
        INT: -10,
        WIL: -10,
        END: 10,
      },
    },
    skills: {
      Athletics: 10,
      Blade: 10,
      Blunt: 10,
      "Heavy Armor": 5,
      "Light Armor": 5,
      Mercantile: 5,
    },
  },
};

export type Race =
  | "Altmer"
  | "Argonian"
  | "Bosmer"
  | "Breton"
  | "Dunmer"
  | "Imperial"
  | "Khajiit"
  | "Nord"
  | "Orc"
  | "Redguard";

const races: Race[] = [
  "Altmer",
  "Argonian",
  "Bosmer",
  "Breton",
  "Dunmer",
  "Imperial",
  "Khajiit",
  "Nord",
  "Orc",
  "Redguard",
];
export default races;
