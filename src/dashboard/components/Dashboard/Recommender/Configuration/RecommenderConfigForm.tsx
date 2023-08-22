// next.js
// react
import React, { ReactElement, useEffect, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import Labeled from "@/components/Labeled";
// mui
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { IRecommenderModel } from "@/components/Dashboard/Recommender/Configuration/ListOfModels";
import EASEConfigForm, {
  IEASEConfigEditableProps,
} from "@/components/Dashboard/Recommender/Configuration/EASEConfigForm";
import GRU4RecConfigForm, {
  IGRU4RecConfigEditableProps,
} from "@/components/Dashboard/Recommender/Configuration/GRU4RecConfigForm";
import EmptyConfigForm from "@/components/Dashboard/Recommender/Configuration/EmptyConfigForm";

export interface IRecommenderConfigEditableProps {
  retrievalSize: number;
  orderingSize: number;
  easeConfig: IEASEConfigEditableProps;
  gru4recConfig: IGRU4RecConfigEditableProps;
}

export interface IRecommenderConfigFormProps
  extends IRecommenderConfigEditableProps {
  models: IRecommenderModel[];
  info: any;
  onChange: (data: IRecommenderConfigEditableProps) => void;
}

const RecommenderConfigForm = ({
  models,
  retrievalSize,
  orderingSize,
  easeConfig,
  gru4recConfig,
  info,
  onChange,
}: IRecommenderConfigFormProps) => {
  const [configFormState, setConfigFormState] =
    useState<IRecommenderConfigEditableProps>({
      retrievalSize,
      orderingSize,
      easeConfig,
      gru4recConfig,
    });

  const [modelDisplayed, setModelDisplayed] = useState<string>(models[0].name);

  useEffect(() => {
    setModelDisplayed(models[0].name);
  }, [models]);

  const renderConfig = (model: IRecommenderModel) => {
    if (model.name === "ease") {
      return (
        <EASEConfigForm
          key={model.name}
          info={info.easeConfig}
          onChange={(data) => {
            setConfigFormState((prevState) => {
              const result = {
                ...prevState,
                easeConfig: data,
              };
              onChange(result);
              return result;
            });
          }}
          {...configFormState.easeConfig}
        />
      );
    } else if (model.name === "gru4rec") {
      return (
        <GRU4RecConfigForm
          key={model.name}
          info={info.gru4recConfig}
          onChange={(data) => {
            setConfigFormState((prevState) => {
              const result = {
                ...prevState,
                gru4recConfig: data,
              };
              onChange(result);
              return result;
            });
          }}
          {...configFormState.gru4recConfig}
        />
      );
    } else {
      return <EmptyConfigForm key={model.name} name={model.title} />;
    }
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
      <Typography variant={"h4"} sx={{ mb: 2 }}>{`Configuration`}</Typography>
      <Grid container p={1} spacing={1}>
        <Grid item xs={12} sm={6}>
          <Labeled
            label={info.retrievalSize.title}
            description={info.retrievalSize.description}
          >
            <Input
              // disabled={!hasPermission}
              type="number"
              value={configFormState.retrievalSize}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                const value = parseInt(e.target.value);
                setConfigFormState((prevState) => {
                  const result = {
                    ...prevState,
                    retrievalSize: value,
                  };
                  onChange(result);
                  return result;
                });
              }}
            />
          </Labeled>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Labeled
            label={info.orderingSize.title}
            description={info.orderingSize.description}
          >
            <Input
              // disabled={!hasPermission}
              type="number"
              value={configFormState.orderingSize}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                const value = parseInt(e.target.value);
                setConfigFormState((prevState) => {
                  const result = {
                    ...prevState,
                    orderingSize: value,
                  };
                  onChange(result);
                  return result;
                });
              }}
            />
          </Labeled>
        </Grid>
        <Grid item xs={12} my={2}>
          <TabContext value={modelDisplayed}>
            <TabList
              onChange={(e, value) => {
                setModelDisplayed(value);
              }}
            >
              {models.map((model) => (
                <Tab key={model.name} label={model.title} value={model.name} />
              ))}
            </TabList>
            {models.map((model) => (
              <TabPanel sx={{ p: 2 }} key={model.name} value={model.name}>
                {renderConfig(model)}
              </TabPanel>
            ))}
          </TabContext>
        </Grid>
      </Grid>
    </Card>
  );
};

RecommenderConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default RecommenderConfigForm;
