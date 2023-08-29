import React from "react";
import { styled } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

interface IOptionItemProps {
  value: any;
  canBeDeleted: boolean;
  onDelete: () => void;
}

const StyledSpan = styled("span")({
  display: "inline",
  backgroundColor: "#eeeeee",
  padding: "5px",
  margin: "5px",
  borderRadius: "5px",
});

const OptionItem = ({ value, canBeDeleted, onDelete }: IOptionItemProps) => (
  <StyledSpan>
    {value}
    {canBeDeleted && (
      <IconButton
        size={"small"}
        onClick={onDelete}
        sx={{ position: "relative", top: "-1px", left: "2px" }}
      >
        <ClearIcon fontSize={"small"} />
      </IconButton>
    )}
  </StyledSpan>
);

export default OptionItem;
