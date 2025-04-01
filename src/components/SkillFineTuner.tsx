import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Skill } from '@/utils/skillUtils';
import { shorthandBySkill } from '@/utils/skillUtils';
import { cn } from '@/utils/cn';

export default function SkillFineTuner({
  skill,
  value,
  className = '',
  onIncrement,
  onDecrement,
}: {
  skill: Skill;
  value: number;
  className: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <Box className={cn('flex w-24 flex-col place-items-center text-center', className)}>
      <Typography className="whitespace-nowrap">Fine Tune</Typography>
      <div className="place-items-center">
        <Typography className="hidden whitespace-nowrap text-xs lg:block">{skill}</Typography>
        <Typography className="block whitespace-nowrap text-xs lg:hidden">
          {shorthandBySkill[skill]}
        </Typography>
        <div className="flex flex-row place-items-center">
          <IconButton onClick={onDecrement}>
            <RemoveIcon />
          </IconButton>
          <Typography className="min-w-4">{value}</Typography>
          <IconButton onClick={onIncrement}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </Box>
  );
}
