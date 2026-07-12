import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Skill } from '@/utils/skillUtils';
import { shorthandBySkill } from '@/utils/skillUtils';
import { cn } from '@/utils/cn';
import SkillIcon from '@/components/SkillIcon';

export default function SkillFineTuner({
  skill,
  value,
  className = '',
  compact,
  onIncrement,
  onDecrement,
}: {
  skill: Skill;
  value: number;
  className: string;
  compact?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <Box className={cn('flex w-24 flex-col place-items-center text-center', className)}>
      <Typography className="whitespace-nowrap">Fine Tune</Typography>
      <div className="place-items-center">
        <Typography
          className={
            compact
              ? 'hidden'
              : 'hidden whitespace-nowrap text-xs lg:inline-flex lg:items-center'
          }
        >
          <SkillIcon skill={skill} size={14} style={{ marginRight: 4 }} />
          {skill}
        </Typography>
        <Typography
          className={
            compact
              ? 'inline-flex items-center whitespace-nowrap text-xs'
              : 'inline-flex items-center whitespace-nowrap text-xs lg:hidden'
          }
        >
          <SkillIcon skill={skill} size={14} style={{ marginRight: 4 }} className="hidden sm:inline-block" />
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
