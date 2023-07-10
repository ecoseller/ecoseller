import { useTranslation } from "next-i18next";
import React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import OptionItem from "@/components/Dashboard/Recommender/OptionItem";

interface IOptionsFormProps {
  title: string;
  options: any[];
}

const OptionsForm = ({ title, options }: IOptionsFormProps) => {
  const { t } = useTranslation("recommender");
  
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        {title}
      </Typography>
      <Typography variant="body1">
        {options.map((option) =>
          <OptionItem key={option} value={option} />
        )}
      </Typography>
    </Stack>
  );
};

export default OptionsForm;
