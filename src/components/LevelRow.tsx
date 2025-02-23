import attributes, {
  skillsByAttribute,
  getRemainingSkillUpsForMaxAttribute,
} from "@/utils/attributeUtils";
import type { Attribute } from "@/utils/attributeUtils";
import { Level } from "@/types/level";
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { MAX_SKILL_LEVEL, Skill, SkillsSet } from "@/utils/skillUtils";

export default function DropDown({
  level,
  previousLevel,
  onRemoveHandler,
  onModifyHandler,
}: {
  level: Level;
  previousLevel: Level | undefined;
  onRemoveHandler?: () => void;
  onModifyHandler?: () => void;
}) {
  const getExtraSkillUpsForAttribute = (
    attribute: Attribute,
    skills: SkillsSet,
  ): number => {
    return (
      skillsByAttribute[attribute].reduce((sum, skill: Skill) => {
        const remaining = MAX_SKILL_LEVEL - skills[skill];
        return sum + remaining;
      }, 0) - getRemainingSkillUpsForMaxAttribute(level.attributes[attribute])
    );
  };

  return (
    <TableRow key={level.level}>
      <TableCell align="center" className="px-0">
        {level.level}
      </TableCell>
      {attributes.map((attribute: Attribute) => (
        <TableCell key={attribute} align="center" className="px-0">
          <Tooltip
            {...(attribute !== "LCK"
              ? {
                  title: `${getRemainingSkillUpsForMaxAttribute(level.attributes[attribute])} skill ups to go (${getExtraSkillUpsForAttribute(attribute, level.skills)} extra)`,
                }
              : { title: "" })}
          >
            <Typography
              {...(previousLevel &&
              level.attributes[attribute] > previousLevel.attributes[attribute]!
                ? { color: "secondary" }
                : {})}
            >
              {level.attributes[attribute]}
            </Typography>
          </Tooltip>
        </TableCell>
      ))}
      <TableCell className="hidden 2xl:table-cell px-0" align="center">
        <Typography
          {...(previousLevel && level.health > previousLevel.health
            ? { color: "secondary" }
            : {})}
        >
          {level.health}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell px-0" align="center">
        <Typography
          {...(previousLevel && level.magicka > previousLevel.magicka
            ? { color: "secondary" }
            : {})}
        >
          {level.magicka}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell px-0" align="center">
        <Typography
          {...(previousLevel && level.stamina > previousLevel.stamina
            ? { color: "secondary" }
            : {})}
        >
          {level.stamina}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell px-0" align="center">
        <Typography
          {...(previousLevel && level.encumbrance > previousLevel.encumbrance
            ? { color: "secondary" }
            : {})}
        >
          {level.encumbrance}
        </Typography>
      </TableCell>
      <TableCell align="center">
        {onModifyHandler ? (
          <Tooltip title="Modify">
            <IconButton
              className="p-0 px-1"
              aria-label="Modify"
              onClick={() => onModifyHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {onRemoveHandler ? (
          <Tooltip title="Remove">
            <IconButton
              className="p-0 px-1"
              aria-label="Delete"
              onClick={() => onRemoveHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
