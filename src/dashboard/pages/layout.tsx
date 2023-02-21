import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";

const RootLayout = ({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#8E44AD",
      },
      secondary: {
        main: "#233044",
      },
    },
    typography: {
      h1: {
        fontWeight: 600,
        lineHeight: 1.13,
      },
      h2: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 4,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

export default RootLayout;
