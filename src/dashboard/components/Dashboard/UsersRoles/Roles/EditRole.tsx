// next.js
// react
import { ChangeEvent } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IPermission, IGroup } from "@/types/user";
import CheckboxList from "./RolesList";

interface ICreateRoleProps {
  group: IGroup;
  setGroup: (group: IGroup) => void;
  permissions: IPermission[];
}

const EditRole = ({ group, setGroup, permissions }: ICreateRoleProps) => {
  return (
    <EditorCard>
      <Typography variant="h6">Edit role {group.name}</Typography>
      <Box mt={2}>
        <Stack spacing={2}>
          <TextField label="Name" value={group.name} disabled={true} />
          {/* <TextField label="Name" /> */}
        </Stack>
      </Box>
      <Box mt={2}>
        <Stack spacing={2}>
          <TextField
            label="Description"
            value={group.description}
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
export default EditRole;
