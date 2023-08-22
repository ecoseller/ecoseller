import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import OptionItem from "@/components/Dashboard/Recommender/Configuration/OptionItem";
import Labeled from "@/components/Labeled";

interface IOptionsFormProps {
  title: string;
  description?: string;
  options: any[];
}

const OptionsForm = ({ title, description, options }: IOptionsFormProps) => {
  return (
    <Stack spacing={2}>
      <Labeled label={title} description={description}>
        <Typography variant="body1" pt={1}>
          {options.map((option) => (
            <OptionItem key={option} value={option} />
          ))}
        </Typography>
      </Labeled>
    </Stack>
  );
};

export default OptionsForm;
