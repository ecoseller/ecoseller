"use client";

// app/login/page.tsx
import Image from "next/image";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Logo from "/public/logo/black/ecoseller.io.svg";
import Link from "next/link";

const Page = () => {
  return (
    <Box
      sx={{
        my: 12,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bottom: "25%",
        // width: 2/3,
        // alignItems: 'center',
      }}
    >
      <Link href={"https://ecoseller.io"}>
        <Box
          sx={{
            height: "40px",
            flexShrink: 0,
            backgroundImage: "url(/logo/black/ecoseller.io.svg)",
            backgroundSize: "contain",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            marginBottom: 2,
          }}
        />
      </Link>
      <Typography component="h1" variant="h4" sx={{}}>
        Welcome back!
      </Typography>
      <Box sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-mail Address"
          name="e-mail"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
        <Button
          type="submit"
          color="primary"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, height: 70 }}
        >
          Login
        </Button>
        <Grid container>
          <Grid item xs>
            {/* Forgot password? */}
          </Grid>
          <Grid item>{/* {"Don't have an account? Sign Up"} */}</Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Page;
