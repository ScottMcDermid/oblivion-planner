import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons({
  name,
  value,
  options,
  onChangeHandler,
}: {
  name: string;
  value: string | null;
  options: string[];
  onChangeHandler: (a: string) => void;
}) {
  return (
    <ToggleButtonGroup
      aria-labelledby={`${name}`}
      exclusive
      value={value}
      onChange={(_e: React.MouseEvent<HTMLElement>, selectedValue: string) =>
        onChangeHandler(selectedValue)
      }
      sx={{ width: '100%' }}
    >
      {options.map((option) => (
        <ToggleButton aria-label={option} key={option} value={option} sx={{ flex: 1, py: 0.5, fontSize: '0.75rem' }}>
          {option}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
