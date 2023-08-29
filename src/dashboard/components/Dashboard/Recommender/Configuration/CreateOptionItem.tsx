import React, { useState } from "react";
import { styled } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

interface IOptionItemProps {
  onSave: (value: number) => void;
}

const StyledSpan = styled("span")({
  display: "inline",
  backgroundColor: "#eeeeee",
  padding: "5px",
  margin: "5px",
  borderRadius: "5px",
});

const CreateOptionItem = ({ onSave }: IOptionItemProps) => {
  const [valueState, setValueState] = useState<string>("");

  return (
    <Box p={1}>
      <Input
        placeholder={"Add new option"}
        type="number"
        value={valueState}
        onChange={(
          e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => {
          setValueState(e.target.value);
        }}
      />
      {valueState !== "" && (
        <IconButton
          size={"small"}
          onClick={() => {
            const value = parseFloat(valueState);
            onSave(value);
            setValueState("");
          }}
          sx={{ position: "relative", top: "-1px", left: "2px" }}
        >
          <CheckIcon fontSize={"small"} />
        </IconButton>
      )}
    </Box>
  );
};

export default CreateOptionItem;
