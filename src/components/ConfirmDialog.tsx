import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function ConfirmDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: (confirm: boolean) => void;
}) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
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
