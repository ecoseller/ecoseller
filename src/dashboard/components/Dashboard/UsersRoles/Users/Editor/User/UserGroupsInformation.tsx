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
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Input,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
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

const UserGroupsInformation = ({ state, setState, groups }: IGroupsProps) => {
  console.log(groups);

  const handleCheckChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setState({
        ...state,
        roles: [...state.roles, event.target.id],
      });
    } else {
      setState({
        ...state,
        roles: state.roles.filter((role) => role !== event.target.id),
      });
    }
  };

  return (
    <EditorCard>
      <Typography variant="h6">Groups</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <FormGroup>
              {groups?.map((group: IGroup) => {
                return (
                  <Box mt={2} key={group.name}>
                    <FormControlLabel
                      key={group.name}
                      label={group.name}
                      control={
                        <Checkbox
                          id={group.name}
                          checked={state.roles.includes(group.name)}
                          onChange={handleCheckChange}
                        />
                      }
                    />
                    <FormHelperText>{group.description}</FormHelperText>
                  </Box>
                );
              })}
            </FormGroup>
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default UserGroupsInformation;
