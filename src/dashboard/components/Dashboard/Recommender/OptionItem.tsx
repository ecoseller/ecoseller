import React from "react";
import { styled } from "@mui/system";

interface IOptionItemProps {
  value: any;
}

const StyledSpan = styled("span")({
  display: "inline",
  backgroundColor: "#eeeeee",
  padding: "5px",
  margin: "5px",
  borderRadius: "5px"
});

const OptionItem = ({ value }: IOptionItemProps) => (
  <StyledSpan>
    {value}
  </StyledSpan>
);

export default OptionItem;
