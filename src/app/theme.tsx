import { createTheme } from "@mui/material/styles";
import { yellow, blue } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[200],
    },
    secondary: {
      main: yellow[500],
    },
  },
  typography: {
    fontSize: 12,
  },
});

export default theme;
