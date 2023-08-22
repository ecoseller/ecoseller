import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";

interface ILabeledProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const Labeled = ({ label, description, children }: ILabeledProps) => (
  <Stack>
    <Typography variant="body1">
      {label}
      {description !== null && description !== undefined && <InfoIcon />}
    </Typography>
    {children}
  </Stack>
);
export default Labeled;
