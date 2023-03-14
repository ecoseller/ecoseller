// next.js
// react
import { useState } from "react";
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
const ProductBasicInfo = () => {
  // simple select with categories

  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField label="ID" />
            <TextField label="Name" />
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default ProductBasicInfo;
