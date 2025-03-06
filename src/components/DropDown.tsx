import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function DropDown({
  label,
  value,
  options,
  onChangeHandler,
}: {
  label?: string;
  value: string;
  options: string[];
  onChangeHandler: (a: string) => void;
}) {
  return (
    <div className="mx-1 my-4 min-w-48">
      {label ? <div className="text-lg">{label}</div> : null}
      <Select
        className="w-full"
        value={value}
        onChange={(e: SelectChangeEvent) => onChangeHandler(e.target.value as string)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
