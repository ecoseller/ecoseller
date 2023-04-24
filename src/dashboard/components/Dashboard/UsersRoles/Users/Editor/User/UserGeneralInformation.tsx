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
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
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
                            disabled={false}
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
                            label="Last Name"
                            value={state?.last_name}
                            disabled={false}
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
                        <FormControlLabel
                            label="Is Admin"
                            control={
                                <Checkbox
                                    checked={state.is_admin}
                                    onChange={(e) => {
                                        setState({
                                            ...state,
                                            is_admin: e.target.checked,
                                        });

                                    }}
                                />
                            }
                        />
                        {/* <TextField label="Name" /> */}
                    </Stack>
                </FormControl>
            </Box>
        </EditorCard>
    );
};

export default UserGeneralInformation;
