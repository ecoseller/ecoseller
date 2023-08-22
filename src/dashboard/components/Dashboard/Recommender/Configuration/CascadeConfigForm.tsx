// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import ModelCascadeItem from "@/components/Dashboard/Recommender/Configuration/ModelCascadeItem";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";
// mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

export interface ICascadeConfigFormProps {
  name: string;
  title: string;
  description: string;
  cascade: string[] | null;
  models: IRecommenderModel[];
}

const CascadeConfigForm = ({
  name,
  title,
  description,
  cascade,
  models,
}: ICascadeConfigFormProps) => {
  const cascadeModels = cascade?.map((modelName) => {
    return (
      models.find((model) => {
        return model.name === modelName;
      }) ?? {
        name: modelName,
        title: modelName,
        description: "",
        disabled: false,
      }
    );
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Box>
        {cascadeModels !== undefined &&
          cascadeModels.map((model) => (
            <ModelCascadeItem key={model.name} title={model.title} />
          ))}
      </Box>
    </Stack>
  );
};

CascadeConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CascadeConfigForm;
