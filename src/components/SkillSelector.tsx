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
  incrementHandler,
  decrementHandler,
}: {
  skill: Skill;
  major: boolean;
  value: number;
  color?: string;
  incrementHandler: () => void;
  decrementHandler: () => void;
}) {
  return (
    <Box className="flex flex-col my-3">
      <Typography
        {...(major ? { color: "default" } : { color: "grey" })}
        className="text-center text-xs whitespace-nowrap"
      >
        {skill}
        {major ? "*" : ""}
      </Typography>
      <Box className="flex flex-row">
        <IconButton
          aria-label={`decrement ${skill}`}
          size="small"
          onClick={() => decrementHandler()}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography
          color={color}
          className="text-sm flex-grow content-center text-center"
        >
          {value}
        </Typography>
        <IconButton
          aria-label={`increment ${skill}`}
          size="small"
          onClick={() => incrementHandler()}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
