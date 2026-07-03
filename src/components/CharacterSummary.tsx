'use client';

import React from 'react';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import type { Attribute } from '@/utils/attributeUtils';
import type { Birthsign } from '@/utils/birthsignUtils';
import type { Gender } from '@/utils/genderUtils';
import type { Race } from '@/utils/raceUtils';
import type { Skill } from '@/utils/skillUtils';
import type { Specialization } from '@/utils/specializationUtils';
import type { AbilityName } from '@/utils/abilityUtils';

import attributes, { skillsByAttribute, shorthandByAttribute } from '@/utils/attributeUtils';
import { locationOriginByRaceAndGender } from '@/utils/raceUtils';
import SkillIcon from '@/components/SkillIcon';

interface CharacterSummaryProps {
  race: Race;
  gender: Gender;
  birthsign: Birthsign;
  specialization: Specialization;
  favoredAttributes: Attribute[];
  majorSkills: Skill[];
  activeAbilities: AbilityName[];
  remastered: boolean;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-ghost">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function CharacterSummary({
  race,
  gender,
  birthsign,
  specialization,
  favoredAttributes,
  majorSkills,
  activeAbilities,
  remastered,
}: CharacterSummaryProps) {
  return (
    <div>
      <div className="mb-4 text-3xl">Character</div>
      <InfoRow label="Race" value={race} />
      {remastered ? (
        <InfoRow label="Origin" value={locationOriginByRaceAndGender[race][gender]} />
      ) : (
        <InfoRow label="Gender" value={gender} />
      )}
      <InfoRow label="Birthsign" value={birthsign} />

      <Divider className="my-4" />

      <div className="mb-4 text-3xl">Class</div>
      <InfoRow label="Specialization" value={specialization} />

      <div className="mt-4">
        <div className="mb-2 text-ghost">Favored Attributes</div>
        <div className="flex flex-wrap gap-2">
          {favoredAttributes.map((attr) => (
            <Chip key={attr} label={attr} size="small" variant="outlined" />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-ghost">Major Skills</div>
        <div className="space-y-2">
          {attributes.map((attribute) => {
            const majors = skillsByAttribute[attribute].filter((skill) =>
              majorSkills.includes(skill),
            );
            if (majors.length === 0) return null;
            return (
              <div key={attribute} className="flex items-start gap-2">
                <span className="w-8 shrink-0 text-xs text-ghost">
                  {shorthandByAttribute[attribute]}
                </span>
                <div className="flex flex-wrap gap-1">
                  {majors.map((skill) => (
                    <Chip key={skill} icon={<SkillIcon skill={skill} size={14} />} label={skill} size="small" variant="outlined" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeAbilities.length > 0 && (
        <>
          <Divider className="my-4" />
          <div className="mb-2 text-ghost">Abilities</div>
          <div className="flex flex-wrap gap-2">
            {activeAbilities.map((ability) => (
              <Chip key={ability} label={ability} size="small" variant="outlined" />
            ))}
          </div>
        </>
      )}

      {remastered && (
        <div className="mt-4">
          <Chip label="Remastered" size="small" color="secondary" />
        </div>
      )}
    </div>
  );
}
