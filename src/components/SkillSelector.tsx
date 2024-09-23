import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Skill } from "@/data/skills";
import { IconButton, Typography } from "@mui/material";

export default function SkillSelector({
  skill,
  major,
  value,
  color = "",
  onChangeHandler,
}: {
  skill: Skill;
  major: boolean;
  value: number;
  color?: string;
  onChangeHandler: (value: number) => void;
}) {
  const handleDecrement = () => {
    onChangeHandler(value - 1);
  };
  const handleIncrement = () => {
    onChangeHandler(value + 1);
  };

  return (
    <Box className="flex flex-col min-w-32 px-2">
      <Typography className="text-center">
        {skill} {major ? "(*)" : ""}
      </Typography>
      <Box className="flex flex-row">
        <IconButton
          aria-label={`decrement ${skill}`}
          size="small"
          onClick={() => handleDecrement()}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography
          color={color}
          className="text-lg flex-grow content-center text-center"
        >
          {value}
        </Typography>
        <IconButton
          aria-label={`increment ${skill}`}
          size="small"
          onClick={() => handleIncrement()}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
