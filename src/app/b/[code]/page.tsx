'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeBuild } from '@/utils/buildCodec';
import { abilities } from '@/utils/abilityUtils';
import { getSkillsSetTemplate, type SkillsSet } from '@/utils/skillUtils';
import { levelTemplate, levelUpTemplate } from '@/utils/levelUtils';
import { useCharacterStore } from '@/data/characterStore';
import Planner from '@/components/Planner';

export default function BuildPage() {
  const params = useParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      setReady(true);
      return;
    }

    const build = decodeBuild(code);
    if (!build) {
      setReady(true);
      return;
    }

    // Recompute abilityModifiers from activeAbilities
    const abilityModifiers: SkillsSet = getSkillsSetTemplate();
    for (const abilityName of build.activeAbilities) {
      const mods = abilities[abilityName];
      if (mods) {
        for (const [skill, value] of Object.entries(mods)) {
          abilityModifiers[skill as keyof SkillsSet] += value as number;
        }
      }
    }

    // Write directly to localStorage in the format Zustand's persist middleware expects.
    // This must happen before Planner mounts so Zustand rehydrates with the shared build.
    const persistedState = {
      state: {
        remastered: build.remastered,
        activeAbilities: build.activeAbilities,
        abilityModifiers,
        isFirstVisit: false,
        race: build.race,
        gender: build.gender,
        birthsign: build.birthsign,
        specialization: build.specialization,
        favoredAttributes: build.favoredAttributes,
        majorSkills: build.majorSkills,
        currentLevel: levelTemplate,
        currentLevelUp: levelUpTemplate,
        levels: [],
        levelUps: build.levelUps,
        version: 2,
      },
      version: 2,
    };

    localStorage.setItem('oblivion-planner', JSON.stringify(persistedState));

    // If the Zustand store is already initialized (e.g. same-tab navigation),
    // force it to re-read from localStorage so it picks up the shared build.
    if (useCharacterStore.persist.hasHydrated()) {
      useCharacterStore.persist.rehydrate();
    }

    setReady(true);
  }, [params.code]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1e1e]">
        <p className="text-lg text-gray-400">Loading build...</p>
      </div>
    );
  }

  return <Planner />;
}
