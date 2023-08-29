import React from "react";
import { styled } from "@mui/system";

interface IModelCascadeItemProps {
  title: string;
}

const StyledSpan = styled("span")({
  display: "inline",
  backgroundColor: "#eeeeee",
  padding: "5px",
  margin: "5px",
  borderRadius: "5px",
});

const ModelCascadeItem = ({ title }: IModelCascadeItemProps) => (
  <StyledSpan sx={{ cursor: "pointer" }}>{title}</StyledSpan>
);

export default ModelCascadeItem;
