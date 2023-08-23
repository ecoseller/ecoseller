// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
// mui
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";

export interface IRecommenderModel {
  name: string;
  title: string;
  description: string;
  isReadyForTraining: boolean;
  canBeTrained: boolean;
  isTrained: boolean;
  disabled: boolean;
}

export interface IListOfModelsProps {
  models: IRecommenderModel[];
  onChange: (models: IRecommenderModel[]) => void;
}

interface IListOfModelsItemProps extends IRecommenderModel {
  onDisabledChange: (name: string, value: boolean) => void;
}

const ListOfModelsItem = ({
  name,
  title,
  description,
  disabled,
  canBeTrained,
  isReadyForTraining,
  isTrained,
  onDisabledChange,
}: IListOfModelsItemProps) => {
  const [disabledState, setDisabledState] = useState<boolean>(disabled);

  return (
    <Grid container p={1}>
      <Grid item xs={12} sm={8}>
        <Typography variant={"h5"}>{title}</Typography>
        <Typography>{description}</Typography>
      </Grid>
      <Grid item xs={12} sm={4} textAlign={"right"}>
        <FormControlLabel
          control={
            <Switch
              disabled={name === "dummy"}
              checked={!disabledState}
              onChange={(e) => {
                setDisabledState(!e.target.checked);
                onDisabledChange(name, !e.target.checked);
              }}
            />
          }
          label={"Enabled"}
          labelPlacement={"start"}
        />
        <Typography
          sx={{ color: isReadyForTraining || !canBeTrained ? "green" : "red" }}
        >
          {isReadyForTraining || !canBeTrained
            ? !canBeTrained
              ? "Does not need training"
              : "Available for training"
            : "Not available for training"}
        </Typography>
        <Typography sx={{ color: isTrained ? "green" : "red" }}>
          {isTrained
            ? "Available for prediction"
            : "Not available for prediction"}
        </Typography>
      </Grid>
    </Grid>
  );
};

const ListOfModels = ({ models, onChange }: IListOfModelsProps) => {
  const [modelsState, setModelsState] = useState<IRecommenderModel[]>(models);

  const onDisabledChange = (name: string, value: boolean) => {
    setModelsState((prevState) => {
      const newState = prevState.map((model) => {
        if (model.name === name) {
          return { ...model, disabled: value };
        } else {
          return model;
        }
      });
      onChange(newState);
      return newState;
    });
  };

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme: any) => theme.palette["info"].darker,
        bgcolor: (theme: any) => theme.palette["info"].lighter,
      }}
    >
      <Typography
        variant={"h4"}
        sx={{ mb: 2 }}
      >{`Prediction models`}</Typography>
      {modelsState.map((model, idx) => {
        const result = [
          <ListOfModelsItem
            key={model.name}
            onDisabledChange={onDisabledChange}
            {...model}
          />,
        ];
        if (idx < modelsState.length - 1) {
          result.push(<Divider sx={{ my: 1 }} />);
        }
        return result;
      })}
    </Card>
  );
};

ListOfModels.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default ListOfModels;
