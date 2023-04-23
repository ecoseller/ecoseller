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
import { FormControlLabel, FormGroup, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from '@mui/material/Checkbox';
import {
    ActionSetProduct,
    IProduct,
    IProductType,
    ISetProductStateData,
} from "@/types/product";
import { IGroup, IUser } from "@/types/user";
import { CheckBox } from "@mui/icons-material";

interface IGroupsProps {
    state: IUser;
    setState: (data: IUser) => void;
    groups: IGroup[];
}

const UserGroupsInformation = ({
    state,
    setState,
    groups,
}: IGroupsProps) => {
    // simple select with categories
    console.log("GROUPS", groups);

    return (
        <EditorCard>
            <Typography variant="h6">Groups</Typography>
            <Box mt={2}>
                <FormControl fullWidth>
                    <Stack spacing={2}>
                        <FormGroup>
                            {groups?.map((group: IGroup) => {
                                return (
                                    <FormControlLabel
                                        label={group.name}
                                        control={
                                            <Checkbox
                                            // checked={checked[0] && checked[1]}
                                            // indeterminate={checked[0] !== checked[1]}
                                            // onChange={handleChange1}
                                            />
                                        }
                                    />
                                    //     onChange={(event) => {
                                    //         if (event.target.checked) {
                                    //             setState({
                                    //                 ...state,
                                    //                 groups: [...state.groups, group.id],
                                    //             });
                                    //         } else {
                                    //             setState({
                                    //                 ...state,
                                    //                 groups: state.groups.filter(
                                    //                     (groupId) => groupId !== group.id
                                    //                 ),
                                    //             });
                                    //         }
                                    //     }}

                                );
                            }
                            )}
                        </FormGroup>
                    </Stack>
                </FormControl>
            </Box>
        </EditorCard >
    );
};

export default UserGroupsInformation;
