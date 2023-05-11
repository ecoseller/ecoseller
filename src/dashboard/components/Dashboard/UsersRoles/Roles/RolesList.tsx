import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import { IPermission, IGroup } from "@/types/user";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import { usePermission } from "@/utils/context/permission";

interface IGroupListProps {
  group: IGroup;
  setGroup: (group: IGroup) => void;
  permissions: IPermission[];
}

const CheckboxList = ({ group, setGroup, permissions }: IGroupListProps) => {
  const [filteredPermissions, setFilteredPermissions] = useState<string[]>(
    permissions?.map((perm) => perm.name)
  );

  const { hasPermission } = usePermission()

  const handleToggle = (permission: IPermission) => () => {
    const checked = group.permissions
      ?.map((perm) => perm.name)
      .includes(permission.name);
    const newPermissions = checked
      ? group.permissions.filter((p) => p.name !== permission.name)
      : [...group.permissions, permission];

    setGroup({
      ...group,
      permissions: newPermissions,
    });
  };

  console.log("group", group);

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <TextField
        id="outlined-basic"
        label="Filter"
        variant="outlined"
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          if (!e.target.value) {
            // default on clear input
            setFilteredPermissions(permissions?.map((perm) => perm.name));
          }

          const results = permissions
            .filter((permission) =>
              permission.name.toLowerCase().includes(e.target.value)
            )
            ?.map((perm) => perm.name);
          setFilteredPermissions(results);
        }}
      />
      {permissions
        ?.filter((permission) => filteredPermissions.includes(permission.name))
        .map((permission) => {
          const labelId = `checkbox-list-label-${permission.name}`;

          return (
            <ListItem key={permission.name} disablePadding>
              <ListItemButton onClick={handleToggle(permission)} dense disabled={!hasPermission}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={group.permissions
                      ?.map((perm) => perm.name)
                      .includes(permission.name)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={permission.name}
                  secondary={permission.description}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
    </List>
  );
};

export default CheckboxList;
