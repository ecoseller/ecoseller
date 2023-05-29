// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import SaveIcon from "@mui/icons-material/Save";
import {
  ActionSetProduct,
  IProduct,
  IProductType,
  ISetProductStateData,
} from "@/types/product";
import { IUser } from "@/types/user";
import { usePermission } from "@/utils/context/permission";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GridActionsCellItem, GridToolbarContainer } from "@mui/x-data-grid";
import { api } from "@/utils/interceptors/api";
import { useUser } from "@/utils/context/user";
import { useSnackbarState } from "@/utils/snackbar";

interface PasswordProps {
  selfEdit: boolean;
  email: string;
  snackbar: any;
  setSnackbar: any;
}

const UserPasswordInformation = ({
  selfEdit = true,
  email,
  snackbar,
  setSnackbar,
}: PasswordProps) => {
  // simple select with categories

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
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
      setHelperText("Passwords do not match");
      return;
    } else {
      setError(false);
      setHelperText("");
    }

    if (selfEdit && oldPassword === newPassword) {
      setError(true);
      setHelperText("New password cannot be the same as old password");
      return;
    }

    if (selfEdit && oldPassword === "") {
      setError(true);
      setHelperText("Old password cannot be empty");
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
        selfEdit: selfEdit,
        email: email,
      }),
    })
      .then((res: any) => {
        if (res.ok) {
          console.log("User updated");
          console.log(snackbar);
          setSnackbar({
            open: true,
            message: "Password updated",
            severity: "success",
          });
        }
      })
      .catch((err: any) => {
        console.log("updateUser", err);
        setSnackbar({
          open: true,
          message: "Something went wrong",
          severity: "error",
        });
      });
  };

  return (
    <EditorCard>
      <Typography variant="h6">Password</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            {selfEdit ? (
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Old Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            ) : null}
            <TextField
              label="New password"
              error={error}
              disabled={!selfEdit && !user?.is_admin}
              helperText={helperText}
              InputLabelProps={{
                shrink: Boolean(true),
              }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="New password confirmation"
              error={error}
              disabled={!selfEdit && !user?.is_admin}
              helperText={helperText}
              InputLabelProps={{
                shrink: Boolean(true),
              }}
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            />
            <Box m={3} marginRight={10}>
              <Button
                variant="outlined"
                disabled={!selfEdit && !user?.is_admin}
                color="primary"
                onClick={handlePasswordChange}
              >
                Set new password
              </Button>
            </Box>
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default UserPasswordInformation;
