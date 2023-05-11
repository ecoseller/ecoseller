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
import { IPermission, IGroup } from "@/types/user";
import CheckboxList from "./RolesList";
import { usePermission } from "@/utils/context/permission";

interface ICreateRoleProps {
  group: IGroup;
  setGroup: (group: IGroup) => void;
  permissions: IPermission[];
}

const CreateRole = ({ group, setGroup, permissions }: ICreateRoleProps) => {
  const { hasPermission } = usePermission();
  return (
    <EditorCard>
      <Typography variant="h6">Create new group</Typography>
      <Box mt={2}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={group.name}
            disabled={!hasPermission}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setGroup({
                ...group,
                name: event.target.value,
              });
            }}
          />
          {/* <TextField label="Name" /> */}
        </Stack>
      </Box>
      <Box mt={2}>
        <Stack spacing={2}>
          <TextField
            label="Description"
            value={group.description}
            disabled={!hasPermission}
            onChange={(
              event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setGroup({
                ...group,
                description: event.target.value,
              });
            }}
          />
          {/* <TextField label="Name" /> */}
        </Stack>
      </Box>
      <Box mt={2}>
        <Stack spacing={2}>
          <CheckboxList
            group={group}
            setGroup={setGroup}
            permissions={permissions}
          />
        </Stack>
      </Box>
    </EditorCard>
  );
};
export default CreateRole;
