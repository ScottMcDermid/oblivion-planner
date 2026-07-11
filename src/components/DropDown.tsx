import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
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
    <FormControl size="small" fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        label={label}
        value={value}
        onChange={(e: SelectChangeEvent) => onChangeHandler(e.target.value as string)}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
