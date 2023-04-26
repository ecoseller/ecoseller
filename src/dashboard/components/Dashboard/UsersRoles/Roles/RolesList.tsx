import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

import { IPermission, IGroup } from '@/types/user';
import { useState } from 'react';

interface IGroupListProps {
    group: IGroup;
    setGroup: (group: IGroup) => void;
    permissions: IPermission[];
}

const CheckboxList = ({ group, setGroup, permissions }: IGroupListProps) => {
    const handleToggle = (permission: IPermission) => () => {
        const checked = group.permissions.includes(permission);
        const newPermissions = checked
            ? group.permissions.filter((p) => p !== permission)
            : [...group.permissions, permission];

        setGroup({
            ...group,
            permissions: newPermissions
        });
    };

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {permissions.map((permission) => {
                const labelId = `checkbox-list-label-${permission.name}`;

                return (
                    <ListItem
                        key={permission.name}
                        disablePadding
                    >
                        <ListItemButton onClick={handleToggle(permission)} dense>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={group.permissions.includes(permission)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={permission.name} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default CheckboxList;