import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import type { Attribute } from '@/utils/attributeUtils';
import { MAX_ATTRIBUTE_LEVEL, shorthandByAttribute } from '@/utils/attributeUtils';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function AttributeSelector({
  attribute,
  base,
  value,
  color,
  maxIncrease,
  selectHandler,
  unselectHandler,
  incrementHandler,
  decrementHandler,
}: {
  attribute: Attribute;
  base: number;
  value: number;
  color?: string;
  maxIncrease: number;
  selectHandler: () => void;
  unselectHandler: () => void;
  incrementHandler: () => void;
  decrementHandler: () => void;
}) {
  const isAttributeMaxed = useMemo(
    () => value >= MAX_ATTRIBUTE_LEVEL || value - base >= maxIncrease,
    [value, base, maxIncrease],
  );

  const isAttributeMin = useMemo(() => value <= 0 || value === base, [value, base]);

  return (
    <Box className="m-1 flex flex-col">
      <Typography color="default" className="whitespace-nowrap text-center text-xs">
        <Typography className="hidden lg:block" component={'span'}>
          {attribute}
        </Typography>
        <Typography className="block lg:hidden" component={'span'}>
          {shorthandByAttribute[attribute]}
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
        aria-label={`select ${attribute}`}
      >
        <Typography color={color || 'primary'}>{value}</Typography>
      </ToggleButton>
      <ToggleButtonGroup className="hidden min-w-20 p-1 lg:flex">
        <ToggleButton
          disabled={isAttributeMin}
          className="w-6 p-0 text-lg"
          value={false}
          aria-label={`decrement ${attribute}`}
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
          disabled={isAttributeMaxed}
          aria-label={`increment ${attribute}`}
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
