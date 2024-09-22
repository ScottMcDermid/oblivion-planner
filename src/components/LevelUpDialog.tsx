import type { Level, LevelUp } from "@/types/level";
import { Skill } from "@/data/skills";

import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function LevelUpDialog({
  currentLevel,
  majorSkills,
  onLevelUp,
}: {
  currentLevel: Level;
  majorSkills: Skill[];
  onLevelUp: (levelUp: LevelUp) => void;
}) {
  return (
    <Dialog open={true}>
      <DialogTitle>level {currentLevel.level}</DialogTitle>
    </Dialog>
  );
}
