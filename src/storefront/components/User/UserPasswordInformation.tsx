// next.js
// react
import { ChangeEvent, useState } from "react";
// utils
import { useTranslation } from "next-i18next";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Generic/EditorCard";
import {
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUser } from "@/utils/context/user";

interface PasswordProps {
  selfEdit: boolean;
  email: string;
  snackbar: any;
  setSnackbar: any;
}

const UserPasswordInformation = ({
  email,
  snackbar,
  setSnackbar,
}: PasswordProps) => {
  // simple select with categories
  const { t } = useTranslation("user");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleClickShowPassword = () => setShowOldPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownNewPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const { user, roles } = useUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  const handlePasswordChange = () => {
    if (newPassword !== newPasswordConfirmation) {
      setError(true);
      setHelperText(`${t("passwords-do-not-match")}`);
      return;
    } else {
      setError(false);
      setHelperText("");
    }

    if (oldPassword === newPassword) {
      setError(true);
      setHelperText(`${t("passwords-are-the-same")}`);
      return;
    }

    if (oldPassword === "") {
      setError(true);
      setHelperText(`${t("old-password-empty")}`);
      return;
    }

    if (newPassword === "" || newPasswordConfirmation === "") {
      setError(true);
      setHelperText("New password cannot be empty");
      return;
    }

    fetch(`/api/user/password`, {
      method: "PUT",
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        email: email,
      }),
    })
      .then((res: any) => {
        if (res.ok) {
          setSnackbar({
            open: true,
            message: t("password-changed"),
            severity: "success",
          });
        }
      })
      .catch((err: any) => {
        setSnackbar({
          open: true,
          message: t("password-not-changed"),
          severity: "error",
        });
      });
  };

  return (
    <EditorCard>
      <Typography variant="h6">{t("password-title")}</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                {t("old-password-label") /* Old Password */}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" error={error}>
              {error ? (
                <FormHelperText id="outlined-adornment-password">
                  {helperText}
                </FormHelperText>
              ) : (
                <InputLabel htmlFor="outlined-adornment-password">
                  {t("new-password") /* New Password */}
                </InputLabel>
              )}
              <OutlinedInput
                id="outlined-adornment-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={t("new-password-label") /* New Password */}
                // label="New Password"
              />
            </FormControl>
            <FormControl fullWidth variant="outlined" error={error}>
              {error ? (
                <FormHelperText id="outlined-adornment-password">
                  {helperText}
                </FormHelperText>
              ) : (
                <InputLabel htmlFor="outlined-adornment-password">
                  {
                    t(
                      "new-password-confirmation-label"
                    ) /* New Password confirmation*/
                  }
                </InputLabel>
              )}
              <OutlinedInput
                id="outlined-adornment-password"
                type={showNewPassword ? "text" : "password"}
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label={
                  t(
                    "new-password-confirmation-label"
                  ) /* New Password confirmation*/
                }
              />
            </FormControl>
            <Box m={3} marginRight={10}>
              <Stack
                direction="row"
                justifyContent="end"
                spacing={5}
                marginRight={7}
                sx={{
                  msTransform: "translateY(-40%)",
                  transform: "translateY(-30%)",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePasswordChange}
                >
                  {t("save") /* Save */}
                </Button>
              </Stack>
            </Box>
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default UserPasswordInformation;
