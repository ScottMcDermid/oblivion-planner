import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Attribute } from '@/utils/attributeUtils';
import { shorthandByAttribute } from '@/utils/attributeUtils';
import { cn } from '@/utils/cn';

export default function AttributeFineTuner({
  attribute,
  value,
  min,
  max,
  className = '',
  onIncrement,
  onDecrement,
}: {
  attribute: Attribute;
  value: number;
  min: number;
  max: number;
  className: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <Box className={cn('flex w-24 flex-col place-items-center text-center', className)}>
      <Typography className="whitespace-nowrap">Fine Tune</Typography>
      <div className="place-items-center">
        <Typography className="hidden whitespace-nowrap text-xs lg:block">{attribute}</Typography>
        <Typography className="block whitespace-nowrap text-xs lg:hidden">
          {shorthandByAttribute[attribute]}
        </Typography>
        <div className="flex flex-row place-items-center">
          <IconButton {...(value < min ? { disabled: true } : {})} onClick={onDecrement}>
            <RemoveIcon />
          </IconButton>
          <Typography className="min-w-4">{value}</Typography>
          <IconButton {...(value >= max ? { disabled: true } : {})} onClick={onIncrement}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </Box>
  );
}
