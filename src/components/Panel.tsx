import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {children}
    </Box>
  );
}

export function PanelHeader({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        variant="caption"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary', fontWeight: 'bold' }}
      >
        {label}
      </Typography>
      {action}
    </Box>
  );
}
