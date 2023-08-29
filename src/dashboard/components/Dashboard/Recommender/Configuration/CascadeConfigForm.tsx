// next.js
// react
import React, { ReactElement, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
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

interface ICascadeProps {
  models: IRecommenderModel[];
}

interface ISortableItemProps {
  key: string;
  index: number;
  title: string;
}

export interface ICascadeConfigFormProps extends ICascadeProps {
  name: string;
  title: string;
  description: string;
  cascade: string[] | null;
  onChange: (cascade: string[]) => void;
}

const SortableItem = SortableElement(
  ({ key, index, title }: ISortableItemProps) => (
    <ModelCascadeItem title={title} />
  )
);

const Cascade = SortableContainer(({ models }: ICascadeProps) => {
  return (
    <Box>
      {models.map((model, index) => (
        // @ts-ignore
        <SortableItem key={model.name} index={index} title={model.title} />
      ))}
    </Box>
  );
});

const CascadeConfigForm = ({
  name,
  title,
  description,
  cascade,
  models,
  onChange,
}: ICascadeConfigFormProps) => {
  const cascadeModels =
    cascade?.map((modelName) => {
      return (
        models.find((model) => {
          return model.name === modelName;
        }) ?? {
          name: modelName,
          title: modelName,
          description: "",
          isReadyForTraining: false,
          canBeTrained: false,
          isTrained: false,
          disabled: false,
        }
      );
    }) || [];

  const [cascadeState, setCascadeState] =
    useState<IRecommenderModel[]>(cascadeModels);

  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    setCascadeState((cascade) => {
      const model = cascade[oldIndex];
      cascade.splice(oldIndex, 1);
      cascade.splice(newIndex, 0, model);
      onChange(cascade.map((model) => model.name));
      return cascade;
    });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      {cascadeState.length > 0 && (
        // @ts-ignore
        <Cascade axis={"x"} models={cascadeState} onSortEnd={onSortEnd} />
      )}
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
