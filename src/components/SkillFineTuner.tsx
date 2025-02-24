import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { Skill } from '@/utils/skillUtils';
import { shorthandBySkill } from '@/utils/skillUtils';

export default function SkillFineTuner({
  skill,
  value,
  onIncrement,
  onDecrement,
}: {
  skill: Skill;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <Box className="flex flex-col text-center">
      <Typography className="whitespace-nowrap">Fine Tune</Typography>
      <div className="place-items-center">
        <Typography className="hidden whitespace-nowrap text-xs lg:block">{skill}</Typography>
        <Typography className="block whitespace-nowrap text-xs lg:hidden">
          {shorthandBySkill[skill]}
        </Typography>
        <div className="flex flex-row place-items-center">
          <IconButton onClick={onDecrement}>
            <RemoveIcon />
          </IconButton>
          <Typography>{value}</Typography>
          <IconButton onClick={onIncrement}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </Box>
  );
}
