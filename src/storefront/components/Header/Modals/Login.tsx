/**
 * /components/Header/Modals/Login.tsx
 * Login modal component for the header menu
 * Its fired from outside (see props) and it opens user login modal
 */

import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
// utils
import { useTranslation } from "next-i18next";
import styles from "./Login.module.scss";

// Cookies
// @ts-ignore
import Cookies from "js-cookie";
// JWT
import jwt_decode from "jwt-decode";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IUser } from "@/types/user";
import { useUser } from "@/utils/context/user";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: 0,
  boxShadow: 24,
  p: 4,
};

interface ILoginModal {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginModal = ({ open, setOpen }: ILoginModal) => {
  const handleOpen = () => setOpen(true);
  const router = useRouter();

  const { t } = useTranslation("common");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  function handleClose() {
    setEmail("");
    setPassword("");
    setOpen(false);
  }

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h1 className={styles.welcome}>{t("welcome-back-login")}</h1>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("email-label")}
          name="e-mail"
          autoComplete="email"
          autoFocus
          defaultValue={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            {t("password-label")}
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setPassword(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={t("password-label")}
          />
        </FormControl>
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
                dashboard_login: false,
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
                handleClose();
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          {t("login-button-label")}
        </Button>
        <Typography variant="body2" align="center">
          {t("dont-have-account")}{" "}
          <a
            href="#"
            onClick={() => {
              handleClose();
              router.push("/user/register");
            }}
          >
            {t("sign-up-button-label")}
          </a>
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoginModal;
