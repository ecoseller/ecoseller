import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import React from "react";

interface ICartSummaryBillingInfoProps {
  rows: ICartInfoTableRow[];
}

export interface ICartInfoTableRow {
  label: string;
  value: string;
}

/**
 * Component displaying cart summary billing/shipping info
 * @param rows
 * @constructor
 */
const CartSummaryInfo = ({ rows }: ICartSummaryBillingInfoProps) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell sx={{ fontWeight: "bold" }}>{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CartSummaryInfo;
