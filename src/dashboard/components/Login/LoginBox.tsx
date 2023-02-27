// /components/login/LoginBox

// next.js
import { useRouter } from "next/router";
// mui
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "next/link";
// components
import Emoji from "../Emoji";
// styles
import styles from "./LoginBox.module.scss";
// public
import Logo from "/public/logo/black/ecoseller.io.svg";

const LoginBox = ({}) => {
  const router = useRouter();
  return (
    <>
      <Link href={"https://ecoseller.io"}>
        <div className={styles.login_logo} />
      </Link>
      <h1 className={styles.welcome}>
        Welcome back!
        <Emoji symbol="✌️" label="peace" />
      </h1>
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
          sx={{ mt: 2, mb: 2, height: 60 }}
          onClick={() => {
            // validate

            // redirect
            router.replace("/dashboard/overview");
          }}
        >
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginBox;
