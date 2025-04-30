import React from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { Level } from '@/utils/levelUtils';
import type { Attribute } from '@/utils/attributeUtils';
import attributes from '@/utils/attributeUtils';

export default function RemasteredLevelRow({
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
  return (
    <>
      <div className="px-0 text-lg">{level.level}</div>
      {attributes.map((attribute: Attribute) => (
        <div key={attribute} className="px-0">
          <Typography
            {...(previousLevel && level.attributes[attribute] > previousLevel.attributes[attribute]!
              ? { color: 'secondary' }
              : {})}
          >
            {level.attributes[attribute]}
          </Typography>
        </div>
      ))}
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.health > previousLevel.health ? { color: 'secondary' } : {})}
        >
          {level.health}
        </Typography>
      </div>
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.magicka > previousLevel.magicka
            ? { color: 'secondary' }
            : {})}
        >
          {level.magicka}
        </Typography>
      </div>
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.stamina > previousLevel.stamina
            ? { color: 'secondary' }
            : {})}
        >
          {level.stamina}
        </Typography>
      </div>
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.encumbrance > previousLevel.encumbrance
            ? { color: 'secondary' }
            : {})}
        >
          {level.encumbrance}
        </Typography>
      </div>
      <div>
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
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
