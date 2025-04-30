import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function ConfirmDialog({
  open,
  description,
  handleClose,
}: {
  open: boolean;
  description?: string;
  handleClose: (confirm: boolean) => void;
}) {
  return (
    <Dialog onClose={() => handleClose(false)} open={open}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        {description && <div className="mb-3">{description}</div>}
        <Button
          onClick={() => {
            handleClose(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleClose(true);
          }}
        >
          Yes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
