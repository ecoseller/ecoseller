// utils
import { useTranslation } from "next-i18next";
// next.js
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Generic/EditorCard";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IUser } from "@/types/user";

interface IUserProps {
  state: IUser;
  setState: (data: IUser) => void;
}

const UserGeneralInformation = ({ state, setState }: IUserProps) => {
  // simple select with categories
  const { t } = useTranslation();

  return (
    <EditorCard>
      <Typography variant="h6">{t("user:general-information")}</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label={t("common:email-label")}
              value={state?.email}
              InputLabelProps={{
                shrink: Boolean(true),
              }}
              disabled={true}
            />
            <TextField
              label={t("common:first-name-label")}
              value={state?.first_name}
              onChange={(e) => {
                setState({
                  ...state,
                  first_name: e.target.value,
                });
              }}
              InputLabelProps={{
                shrink: Boolean(true),
              }}
            />
            <TextField
              label={t("common:last-name-label")}
              value={state?.last_name}
              onChange={(e) => {
                setState({
                  ...state,
                  last_name: e.target.value,
                });
              }}
              InputLabelProps={{
                shrink: Boolean(true),
              }}
            />
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default UserGeneralInformation;
