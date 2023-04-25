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
import { IPermission } from "@/types/user";

interface ICreateRoleProps {
    name: string;
    description: string;
    permissions: IPermission[];
    setName: (name: string) => void;
    setDescription: (description: string) => void;
    setPermissions: (permissions: IPermission[]) => void;
}

const CreateRole = ({
    name,
    description,
    permissions,
    setName,
    setDescription,
    setPermissions,
}: ICreateRoleProps) => {

    return (
        <EditorCard>
            <Typography variant="h6">Create new group</Typography>
            <Box mt={2}>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        value={name}
                        // disabled={true}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                        ) => {
                            setName(event.target.value);
                        }}
                    />
                    {/* <TextField label="Name" /> */}
                </Stack>
            </Box>
            <Box mt={2}>
                <Stack spacing={2}>
                    <TextField
                        label="Description"
                        value={description}
                        // disabled={true}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                        ) => {
                            setDescription(event.target.value);
                        }}
                    />
                    {/* <TextField label="Name" /> */}
                </Stack>
            </Box>
        </EditorCard>
    );
};
export default CreateRole;
