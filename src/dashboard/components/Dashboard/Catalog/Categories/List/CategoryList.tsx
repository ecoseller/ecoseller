import { ICategoryLocalized } from "@/types/category";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Link from "next/link";

interface ICategoryListProps {
  categories: ICategoryLocalized[];
}

const CategoryList = ({ categories }: ICategoryListProps) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell component="th" scope="row">
                  {c.title}
                </TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/catalog/categories/edit/${c.id}`}>
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoryList;
