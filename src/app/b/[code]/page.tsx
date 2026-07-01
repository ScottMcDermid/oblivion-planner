'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCharacterStore } from '@/data/characterStore';
import { decodeBuild } from '@/utils/buildCodec';
import { abilities } from '@/utils/abilityUtils';
import { getSkillsSetTemplate, type SkillsSet } from '@/utils/skillUtils';

export default function BuildPage() {
  const params = useParams();
  const router = useRouter();
  const setCharacterData = useCharacterStore((state) => state.actions.setCharacterData);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      router.replace('/');
      return;
    }

    const build = decodeBuild(code);
    if (!build) {
      router.replace('/');
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

    setCharacterData({
      remastered: build.remastered,
      race: build.race,
      gender: build.gender,
      birthsign: build.birthsign,
      specialization: build.specialization,
      favoredAttributes: build.favoredAttributes,
      majorSkills: build.majorSkills,
      activeAbilities: build.activeAbilities,
      abilityModifiers,
      levelUps: build.levelUps,
      isFirstVisit: false,
    });

    router.replace('/');
  }, [params.code, router, setCharacterData]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg text-gray-400">Loading build...</p>
    </div>
  );
}
