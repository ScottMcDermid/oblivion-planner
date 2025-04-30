import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons({
  name,
  label,
  value,
  options,
  onChangeHandler,
}: {
  name: string;
  label?: string;
  value: string;
  options: string[];
  onChangeHandler: (a: string) => void;
}) {
  return (
    <div className="mx-1 my-4 min-w-48">
      {label ? <div className="text-lg">{label}</div> : null}
      <ToggleButtonGroup
        aria-labelledby={`${name}`}
        exclusive
        value={value}
        onChange={(_e: React.MouseEvent<HTMLElement>, selectedValue: string) =>
          onChangeHandler(selectedValue)
        }
      >
        {options.map((option) => (
          <ToggleButton aria-label={option} key={option} value={option} className="min-w-24">
            {option}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}
