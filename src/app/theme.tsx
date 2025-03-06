import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fde047',
    },
    secondary: {
      main: '#fde047',
    },
    background: {
      default: '#0a0a0a',
    },
    text: {
      primary: '#ededed',
      secondary: '#fde047',
    },
  },
  typography: {
    fontSize: 12,
  },
});

export default theme;
