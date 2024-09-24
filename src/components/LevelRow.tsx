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
      <TableCell align="center">{level.level}</TableCell>
      {attributes.map((attribute: Attribute) => (
        <TableCell key={attribute} align="center">
          <Typography
            {...(previousLevel &&
            level.attributes[attribute] > previousLevel.attributes[attribute]!
              ? { color: "secondary" }
              : {})}
          >
            {level.attributes[attribute]}
          </Typography>
        </TableCell>
      ))}
      <TableCell className="hidden 2xl:table-cell" align="center">
        <Typography
          {...(previousLevel && level.health > previousLevel.health
            ? { color: "secondary" }
            : {})}
        >
          {level.health}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell" align="center">
        <Typography
          {...(previousLevel && level.magicka > previousLevel.magicka
            ? { color: "secondary" }
            : {})}
        >
          {level.magicka}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell" align="center">
        <Typography
          {...(previousLevel && level.stamina > previousLevel.stamina
            ? { color: "secondary" }
            : {})}
        >
          {level.stamina}
        </Typography>
      </TableCell>
      <TableCell className="hidden 2xl:table-cell" align="center">
        <Typography
          {...(previousLevel && level.encumbrance > previousLevel.encumbrance
            ? { color: "secondary" }
            : {})}
        >
          {level.encumbrance}
        </Typography>
      </TableCell>
      <TableCell align="center" className="min-w-16">
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
