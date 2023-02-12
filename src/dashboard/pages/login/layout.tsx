"use client";
// app/login/layout.tsx

import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const LoginLayout = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => {
  const theme = createTheme();

  const Copyright = (props: any) => {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://ecoseller.io/">
          ecoseller.io
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  };

  const [marketingTexts, setMarketingTexts] = useState([
    {
      title: "Meet our smart AI driven platform",
      description:
        "Increase your average cart value with our smart built-in recommendation system.",
    },
    // {
    //   title: 'Rank higher in Google',
    //   description: 'With our smart built-in SEO optimization, you will rank higher in Google.'
    // },
    // {
    //   title: '0 care ecommerce solution',
    //   description: 'We take care of everything, so you can focus on your business.'
    // },
  ]);

  return (
    // <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        {children}
        {/* <Copyright sx={{ mt: 5, position: 'absolute', bottom: 10, alignItems: 'center' }} /> */}
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
        sx={{
          backgroundImage:
            "radial-gradient(circle at 50% 47%, #713789 0%, #642E7A 53%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            my: 12,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              mt: 1,
              alignContent: "center",
              textAlign: "center",
              position: "relative",
              bottom: "25%",
            }}
          >
            {marketingTexts.map((text, index) => (
              <Box key={index} sx={{ mt: 1 }}>
                <Typography
                  component="h2"
                  variant="h3"
                  sx={{ color: "white", fontWeight: 600, fontSize: "2.0rem" }}
                >
                  {text.title}
                </Typography>
                <Typography
                  component="h3"
                  variant="body1"
                  sx={{ color: "white", fontWeight: 400, fontSize: "1.5rem" }}
                >
                  {text.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
    // </ThemeProvider>
  );
};

export default LoginLayout;
