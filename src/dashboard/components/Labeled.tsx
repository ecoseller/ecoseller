import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

interface ILabeledProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const Labeled = ({ label, description, children }: ILabeledProps) => (
  <Stack>
    <Typography variant="body1">
      {label}
      {description !== null && description !== undefined && (
        <Tooltip title={description} arrow placement={"top"}>
          <InfoIcon
            fontSize={"inherit"}
            color={"primary"}
            sx={{ ml: 1, position: "relative", top: "2px" }}
          />
        </Tooltip>
      )}
    </Typography>
    {children}
  </Stack>
);
export default Labeled;
