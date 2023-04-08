import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {
    IUser,
} from "@/types/user";

import OverflowTip from "@/components/Dashboard/Roles/OverflowTip";

interface IUserProps {
    state: IUser[];
    setState: (data: IUser[]) => void;
}

const UsersGeneralInformation = ({
    state,
    setState,
}: IUserProps) => {

    return (
        <TableContainer component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">First Name</TableCell>
                        <TableCell align="right">Last Name</TableCell>
                        <TableCell align="right">Is Admin</TableCell>
                        <TableCell align="right">Roles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.map((state) => (
                        <TableRow
                            key={state.email}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {state.email}
                            </TableCell>
                            <TableCell align="right">{state.first_name}</TableCell>
                            <TableCell align="right">{state.last_name}</TableCell>
                            <TableCell align="right">{state.is_admin ? "True" : "False"}</TableCell>
                            <OverflowTip>
                                <TableCell align="right" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {state.roles.map((role) => (role)).join(", ")}
                                </TableCell>
                            </OverflowTip>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    );
};
export default UsersGeneralInformation;