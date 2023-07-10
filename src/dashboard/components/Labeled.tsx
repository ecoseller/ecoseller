import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface ILabeledProps {
  label: string;
  children: React.ReactNode;
}

const Labeled = ({ label, children }: ILabeledProps) => (
  <Stack>
    <Typography variant="body1">
      {label}
    </Typography>
    {children}
  </Stack>
);
export default Labeled;
