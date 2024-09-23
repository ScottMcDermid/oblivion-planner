import attributes from "@/data/attributes";
import type { Attribute } from "@/data/attributes";
import { Level } from "@/types/level";
import {
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DropDown({
  level,
  previousLevel,
  onDeleteHandler,
}: {
  level: Level;
  previousLevel: Level | undefined;
  onDeleteHandler?: () => void;
}) {
  return (
    <TableRow key={level.level}>
      <TableCell align="right">{level.level}</TableCell>
      {attributes.map((attribute: Attribute) => (
        <TableCell key={attribute} align="right">
          <Typography
            {...(previousLevel &&
            level.attributes[attribute] > previousLevel.attributes[attribute]!
              ? { color: "primary" }
              : {})}
          >
            {level.attributes[attribute]}
          </Typography>
        </TableCell>
      ))}
      <TableCell align="right">
        <Typography
          {...(previousLevel && level.health > previousLevel.health
            ? { color: "primary" }
            : {})}
        >
          {level.health}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography
          {...(previousLevel && level.magicka > previousLevel.magicka
            ? { color: "primary" }
            : {})}
        >
          {level.magicka}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography
          {...(previousLevel && level.stamina > previousLevel.stamina
            ? { color: "primary" }
            : {})}
        >
          {level.stamina}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Typography
          {...(previousLevel && level.encumbrance > previousLevel.encumbrance
            ? { color: "primary" }
            : {})}
        >
          {level.encumbrance}
        </Typography>
      </TableCell>
      <TableCell align="right" className="min-w-16">
        {onDeleteHandler ? (
          <Tooltip title="Remove">
            <IconButton
              className="p-0"
              aria-label="close"
              onClick={() => onDeleteHandler()}
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
