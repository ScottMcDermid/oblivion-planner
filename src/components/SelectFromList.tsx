import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';

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
    <Box>
      <FormControl className="my-4" error={!!error} component="fieldset" variant="standard">
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup className="m-2">
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  color="default"
                  checked={selectedOptions.includes(option)}
                  onChange={() => {
                    handleToggle(option);
                  }}
                  name={option}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
        <FormHelperText className="h-4">{error}</FormHelperText>
      </FormControl>
    </Box>
  );
}
