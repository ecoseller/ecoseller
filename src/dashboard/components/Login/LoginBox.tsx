// /components/login/LoginBox
// react
import { useState } from "react";
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
// axios
import { axiosPrivate } from "@/utils/axiosPrivate";
// Cookies
// @ts-ignore
import Cookies from "js-cookie";
// JWT
import jwt_decode from "jwt-decode";

const LoginBox = ({ }) => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("admin@example.com");
  const [password, setPassword] = useState<string>("admin");

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
          defaultValue={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
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
          defaultValue={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
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
          onClick={async () => {
            // validate
            await fetch("/api/user/login", {
              method: "POST",
              body: JSON.stringify({
                email,
                password,
                dashboard_login: true,
              }),
            })
              .then((res) => res.json())
              .then((data: any) => {
                const accessToken = data.access;
                const refreshToken = data.refresh;

                const accessTokenDecoded: any = jwt_decode(accessToken);
                const refreshTokenDecoded: any = jwt_decode(refreshToken);

                const expiresAccessToken = new Date(
                  accessTokenDecoded.exp * 1000
                );
                const expiresRefreshToken = new Date(
                  refreshTokenDecoded.exp * 1000
                );

                Cookies.set("accessToken", accessToken, {
                  expires: expiresAccessToken,
                });
                Cookies.set("refreshToken", refreshToken, {
                  expires: expiresRefreshToken,
                });

                //redirect
                router.replace("/dashboard/overview");
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginBox;
