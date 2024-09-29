import Box from "@mui/material/Box";
import { MAX_SKILL_LEVEL, shorthandBySkill, Skill } from "@/data/skills";
import { ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function SkillSelector({
  skill,
  major,
  value,
  color = "",
  selectHandler,
  unselectHandler,
}: {
  skill: Skill;
  major: boolean;
  value: number;
  color?: string;
  selectHandler: () => void;
  unselectHandler: () => void;
}) {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selected) selectHandler();
    else unselectHandler();
  }, [selected, selectHandler, unselectHandler]);

  return (
    <Box className="flex flex-col m-1">
      <Typography
        {...(major ? { color: "default" } : { color: "grey" })}
        className="text-center text-xs whitespace-nowrap"
      >
        <Typography className="hidden lg:block" component={"span"}>
          {skill}
          {major ? "*" : ""}
        </Typography>
        <Typography className="block lg:hidden" component={"span"}>
          {shorthandBySkill[skill]}
          {major ? "*" : ""}
        </Typography>
      </Typography>
      <ToggleButton
        className="p-1"
        disabled={value >= MAX_SKILL_LEVEL}
        value={selected}
        selected={selected}
        onClick={() => {
          setSelected(!selected);
        }}
        aria-label={`select ${skill}`}
      >
        <Typography color={color}>{value}</Typography>
      </ToggleButton>
    </Box>
  );
}
