import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e5e7eb',
    },
    secondary: {
      main: '#fde047',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#1e1e1e',
      paper: '#252525',
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#facc15',
    },
  },
  typography: {
    fontSize: 12,
  },
});

export default theme;
