import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function SelectFromList({
  label,
  selectedOptions,
  error,
  options,
  onChangeHandler,
}: {
  label: string;
  selectedOptions: string[];
  error: string | null;
  options: string[];
  onChangeHandler: (a: string[]) => void;
}) {
  const handleToggle = (value: string) => {
    const currentIndex = selectedOptions.indexOf(value);
    const newChecked = [...selectedOptions];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onChangeHandler(newChecked);
  };

  return (
    <div className="my-4">
      <div className="text-lg">{label}</div>
      <div className="m-2 flex flex-col">
        {options.map((option) => (
          <FormControlLabel
            key={option}
            control={
              <Checkbox
                color="primary"
                checked={selectedOptions.includes(option)}
                onChange={() => {
                  handleToggle(option);
                }}
                name={option}
                sx={{
                  color: 'var(--primary)',
                  '&.Mui-checked': {
                    color: 'var(--primary)',
                  },
                }}
              />
            }
            label={option}
          />
        ))}
      </div>
      <div className="h-4 text-xs text-red-500">{error}</div>
    </div>
  );
}
