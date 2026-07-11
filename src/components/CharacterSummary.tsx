'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

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
import { Panel, PanelHeader } from '@/components/Panel';

interface CharacterSummaryProps {
  characterName?: string;
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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="caption">{value}</Typography>
    </Box>
  );
}

export default function CharacterSummary({
  characterName,
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
      {/* Character panel */}
      <Panel>
        <PanelHeader label={characterName || 'Character'} />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <InfoRow label="Race" value={race} />
          {remastered ? (
            <InfoRow label="Origin" value={locationOriginByRaceAndGender[race][gender]} />
          ) : (
            <InfoRow label="Gender" value={gender} />
          )}
          <InfoRow label="Birthsign" value={birthsign} />
        </Box>
      </Panel>

      {/* Class panel */}
      <Panel>
        <PanelHeader label="Class" />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <InfoRow label="Specialization" value={specialization} />

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
              Favored Attributes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {favoredAttributes.map((attr) => (
                <Chip key={attr} label={attr} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
              Major Skills
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {attributes.map((attribute) => {
                const majors = skillsByAttribute[attribute].filter((skill) =>
                  majorSkills.includes(skill),
                );
                if (majors.length === 0) return null;
                return (
                  <Box key={attribute} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', width: '2rem', flexShrink: 0, fontSize: '0.7rem' }}>
                      {shorthandByAttribute[attribute]}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {majors.map((skill) => (
                        <Chip
                          key={skill}
                          icon={<SkillIcon skill={skill} size={14} />}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Panel>

      {/* Abilities panel */}
      {activeAbilities.length > 0 && (
        <Panel>
          <PanelHeader label="Abilities" />
          <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {activeAbilities.map((ability) => (
              <Chip key={ability} label={ability} size="small" variant="outlined" />
            ))}
          </Box>
        </Panel>
      )}

      {remastered && (
        <Box sx={{ mt: 0.5 }}>
          <Chip label="Remastered" size="small" color="secondary" />
        </Box>
      )}
    </div>
  );
}
