"use client";
// app/login/layout.tsx

import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import styles from "./login.module.scss";

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

  return (
    <div className={styles.login_background}>
      {/* <Grid container component="main" sx={{ height: "100vh" }}> */}
      {children}
      {/* </Grid> */}
    </div>
  );
};

export default LoginLayout;
