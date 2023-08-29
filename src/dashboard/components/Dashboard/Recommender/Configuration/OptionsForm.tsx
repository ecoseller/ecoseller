import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import OptionItem from "@/components/Dashboard/Recommender/Configuration/OptionItem";
import Labeled from "@/components/Labeled";
import CreateOptionItem from "@/components/Dashboard/Recommender/Configuration/CreateOptionItem";

interface IOptionsFormProps {
  title: string;
  description?: string;
  options: any[];
  onChange: (options: any[]) => void;
}

const OptionsForm = ({
  title,
  description,
  options,
  onChange,
}: IOptionsFormProps) => {
  const [optionsState, setOptionsState] = useState<any[]>(options);

  const deleteOption = (option: any) => {
    setOptionsState((prevOptionsState) => {
      const newState = prevOptionsState.filter((value) => value !== option);
      onChange(newState);
      return newState;
    });
  };

  const addOption = (option: any) => {
    setOptionsState((prevOptionsState) => {
      // get rid of duplicates
      const newState = prevOptionsState.filter((value) => value !== option);
      newState.push(option);
      onChange(newState);
      return newState;
    });
  };

  return (
    <Stack spacing={2}>
      <Labeled label={title} description={description}>
        <Typography variant="body1" pt={1} sx={{ display: "inline-block" }}>
          {optionsState.map((option) => (
            <OptionItem
              key={option}
              value={option}
              canBeDeleted={optionsState.length > 1}
              onDelete={() => {
                deleteOption(option);
              }}
            />
          ))}
        </Typography>
        <CreateOptionItem
          onSave={(value) => {
            addOption(value);
          }}
        />
      </Labeled>
    </Stack>
  );
};

export default OptionsForm;
