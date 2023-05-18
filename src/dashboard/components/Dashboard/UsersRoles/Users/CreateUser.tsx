// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { usePermission } from "@/utils/context/permission";

interface ICreateUserProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const CreateUser = ({
  email,
  password,
  setEmail,
  setPassword,
}: ICreateUserProps) => {
  // simple select with categories

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const { hasPermission } = usePermission();

  return (
    <EditorCard>
      <Typography variant="h6">Create new user</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={email}
              disabled={!hasPermission}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setEmail(event.target.value);
              }}
            />
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
      <Box mt={2}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            disabled={!hasPermission}
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
            label="Password"
          />
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default CreateUser;
