import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function DropDown({
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
    <FormControl id={name} className="mx-1 flex flex-col">
      {label ? <FormLabel className="text-lg">{label}</FormLabel> : null}
      <RadioGroup
        row
        aria-labelledby={`${name}-group-label`}
        value={value}
        name={`${name}-group`}
        onChange={(e) => onChangeHandler(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            control={<Radio color="primary" />}
            key={option}
            label={option}
            name={name}
            value={option}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
