// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
    ActionSetProduct,
    IProduct,
    IProductType,
    ISetProductStateData,
} from "@/types/product";
import { IUser } from "@/types/user";

interface IUserProps {
    state: IUser;
    setState: (data: IUser) => void;
}

const UserGeneralInformation = ({
    state,
    setState,
}: IUserProps) => {
    // simple select with categories
    console.log("GENERAL INFORMATION", state);

    return (
        <EditorCard>
            <Typography variant="h6">General information</Typography>
            <Box mt={2}>
                <FormControl fullWidth>
                    <Stack spacing={2}>
                        <TextField
                            label="Email"
                            value={state?.email}
                            InputLabelProps={{
                                shrink: Boolean(true),
                            }}
                            disabled={true}
                        />
                        <TextField
                            label="First Name"
                            value={state?.first_name}
                            InputLabelProps={{
                                shrink: Boolean(true),
                            }}
                        />
                        <TextField
                            label="Last Name"
                            value={state?.last_name}
                            InputLabelProps={{
                                shrink: Boolean(true),
                            }}
                        />
                        <TextField
                            label="Is Admin"
                            value={state?.is_admin ? "Yes" : "No"}
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
