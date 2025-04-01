import React from 'react';
import Box from '@mui/material/Box';
import { shorthandBySkill, Skill } from '@/utils/skillUtils';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function SkillSelector({
  skill,
  major,
  base,
  value,
  color,
  selectHandler,
  unselectHandler,
  incrementHandler,
  decrementHandler,
}: {
  skill: Skill;
  major: boolean;
  base: number;
  value: number;
  color?: string;
  selectHandler: () => void;
  unselectHandler: () => void;
  incrementHandler: () => void;
  decrementHandler: () => void;
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
        className="p-1 lg:hidden"
        value={value}
        selected={value !== base}
        onClick={() => {
          if (value === base) selectHandler();
          else unselectHandler();
        }}
        aria-label={`select ${skill}`}
      >
        <Typography color={color || 'primary'}>{value}</Typography>
      </ToggleButton>
      <ToggleButtonGroup className="hidden min-w-20 p-1 lg:flex">
        <ToggleButton
          className="w-6 p-0 text-lg"
          value={false}
          aria-label={`decrement ${skill}`}
          onClick={decrementHandler}
        >
          -
        </ToggleButton>
        <ToggleButton
          value={false}
          onClick={() => {
            if (value === base) selectHandler();
            else unselectHandler();
          }}
          className="flex-1 p-1"
        >
          <Typography color={color || 'primary'}>{value}</Typography>
        </ToggleButton>
        <ToggleButton
          aria-label={`increment ${skill}`}
          value={false}
          onClick={incrementHandler}
          className="w-6 p-0 text-lg"
        >
          +
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
