'use client';

import { useCallback } from 'react';
import { useCharacterStore } from '@/data/characterStore';
import { encodeBuild, type BuildData } from '@/utils/buildCodec';

/**
 * Hook that provides a function to generate a shareable URL for the current build.
 */
export function useShareBuild() {
  const state = useCharacterStore();

  const getShareUrl = useCallback((): string => {
    const buildData: BuildData = {
      remastered: state.remastered,
      race: state.race,
      gender: state.gender,
      birthsign: state.birthsign,
      specialization: state.specialization,
      favoredAttributes: state.favoredAttributes,
      majorSkills: state.majorSkills,
      activeAbilities: state.activeAbilities,
      levelUps: state.levelUps,
    };

    const code = encodeBuild(buildData);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/b/${code}`;
  }, [
    state.remastered,
    state.race,
    state.gender,
    state.birthsign,
    state.specialization,
    state.favoredAttributes,
    state.majorSkills,
    state.activeAbilities,
    state.levelUps,
  ]);

  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [getShareUrl]);

  return { getShareUrl, copyShareUrl };
}
