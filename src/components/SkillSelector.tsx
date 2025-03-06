import React from 'react';
import Box from '@mui/material/Box';
import { shorthandBySkill, Skill } from '@/utils/skillUtils';
import { ToggleButton, Typography } from '@mui/material';

export default function SkillSelector({
  skill,
  major,
  base,
  value,
  color = '',
  selectHandler,
  unselectHandler,
}: {
  skill: Skill;
  major: boolean;
  base: number;
  value: number;
  color?: string;
  selectHandler: () => void;
  unselectHandler: () => void;
}) {
  return (
    <Box className="m-1 flex flex-col">
      <Typography
        {...(major ? { color: 'default' } : { color: 'grey' })}
        className="whitespace-nowrap text-center text-xs"
      >
        <Typography className="hidden lg:block" component={'span'}>
          {skill}
          {major ? '*' : ''}
        </Typography>
        <Typography className="block lg:hidden" component={'span'}>
          {shorthandBySkill[skill]}
          {major ? '*' : ''}
        </Typography>
      </Typography>
      <ToggleButton
        className="p-1"
        value={value}
        selected={value !== base}
        onClick={() => {
          if (value === base) selectHandler();
          else unselectHandler();
        }}
        aria-label={`select ${skill}`}
      >
        <Typography color={color}>{value}</Typography>
      </ToggleButton>
    </Box>
  );
}
