// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import React, { ReactElement, useEffect, useReducer, useState } from "react";
import RootLayout from "@/pages/layout";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// components
import { NextApiRequest, NextApiResponse } from "next";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
import RecommenderConfigForm, {
  IRecommenderConfigEditableProps,
  IRecommenderConfigProps,
} from "@/components/Dashboard/Recommender/RecommenderConfigForm";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import ModelStatistics, {
  IModelProps,
  IModelPerformanceProps,
} from "@/components/Dashboard/Recommender/ModelStatistics";
import StatisticsItem, {
  IStatisticsItemProps,
} from "@/components/Dashboard/Recommender/StatisticsItem";
import CascadeConfig from "@/components/Dashboard/Recommender/CascadeConfig";
import { ITrainingProps } from "@/components/Dashboard/Recommender/Training";
import EditableContentWrapper from "@/components/Dashboard/Generic/EditableContentWrapper";
import { generalSnackbarError, useSnackbarState } from "@/utils/snackbar";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";

interface IRecommenderPerformanceProps {
  k: number;
  item: IStatisticsItemProps;
  models: IModelPerformanceProps[];
}

interface IRecommenderTrainingProps {
  models: ITrainingProps[];
}

interface IRecommenderSystemProps {
  models: IModelProps[];
  performance: IRecommenderPerformanceProps;
  training: IRecommenderTrainingProps;
  config: IRecommenderConfigProps;
}

const DashboardRecommenderSystemPage = ({
  models,
  performance,
  training,
  config,
}: IRecommenderSystemProps) => {
  const [modelDisplayed, setModelDisplayed] = useState<string>("");

  useEffect(() => {
    setModelDisplayed(models[0].name);
  }, [models]);

  const handleModelDisplayedChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setModelDisplayed(newValue);
  };

  const extractCascadeData = (data: IRecommenderConfigProps) => {
    return [
      {
        name: "homepageRetrieval",
        title: "Homepage retrieval",
        cascade: data.homepageRetrievalCascade,
      },
      {
        name: "homepageScoring",
        title: "Homepage scoring",
        cascade: data.homepageScoringCascade,
      },
      {
        name: "categoryListScoring",
        title: "Category list scoring",
        cascade: data.categoryListScoringCascade,
      },
      {
        name: "productDetailRetrieval",
        title: "Product detail retrieval",
        cascade: data.productDetailRetrievalCascade,
      },
      {
        name: "productDetailScoring",
        title: "Product detail scoring",
        cascade: data.productDetailScoringCascade,
      },
      {
        name: "cartRetrieval",
        title: "Cart retrieval",
        cascade: data.cartRetrievalCascade,
      },
      {
        name: "cartScoring",
        title: "Cart scoring",
        cascade: data.cartScoringCascade,
      },
    ];
  };

  const cascades = extractCascadeData(config);

  const [cascadeDisplayed, setCascadeDisplayed] = useState<string>("");

  useEffect(() => {
    setCascadeDisplayed(extractCascadeData(config)[0].name);
  }, [config]);

  const handleCascadeDisplayedChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setCascadeDisplayed(newValue);
  };

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useSnackbarState();

  const [configState, setConfigState] =
    useState<IRecommenderConfigProps>(config);

  const saveConfig = async () => {
    return await fetch(`/api/recommender-system/config/save`, {
      method: "PUT",
      body: JSON.stringify(configState),
    })
      .then((res) => res.json())
      .then((data: any) => {
        console.log("saveConfig", data);
        setPreventNavigation(false);
        setSnackbar({
          open: true,
          message: "Recommender system config updated",
          severity: "success",
        });
      })
      .catch((err: any) => {
        console.log("saveConfig", err);
        setSnackbar(generalSnackbarError);
      });
  };

  return (
    <DashboardLayout>
      <EditableContentWrapper
        preventNavigation={preventNavigation}
        setPreventNavigation={setPreventNavigation}
        onButtonClick={async () => {
          await saveConfig();
        }}
        returnPath={"/dashboard/catalog/products"}
      >
        <Container maxWidth="xl">
          <Typography variant="h4">Global</Typography>
          <Box pl={3} py={2}>
            <Typography variant="h6">Performance</Typography>
            <StatisticsItem {...performance.item} />

            <Typography variant="h6">Configuration</Typography>
            <RecommenderConfigForm
              retrievalSize={config.retrievalSize}
              orderingSize={config.orderingSize}
              onChange={(data: IRecommenderConfigEditableProps) => {
                console.log("data", data);
                console.log("configState", { ...configState, ...data });
                setConfigState({ ...configState, ...data });
                console.log("changed", configState);
              }}
            />
          </Box>

          {/* model statistics */}
          <Typography variant="h4" sx={{ mt: 2 }}>
            Models
          </Typography>
          <TabContext value={modelDisplayed}>
            <Box>
              <TabList onChange={handleModelDisplayedChange}>
                {models.map((model) => (
                  <Tab
                    key={model.name}
                    label={model.title}
                    value={model.name}
                  />
                ))}
              </TabList>
            </Box>
            {models.map((model) => (
              <TabPanel sx={{ padding: 0 }} key={model.name} value={model.name}>
                <ModelStatistics
                  model={model}
                  performance={performance.models.find(
                    (m) => m.name === model.name
                  )}
                  training={training.models.find((m) => m.name === model.name)}
                  globalConfig={config}
                />
              </TabPanel>
            ))}
          </TabContext>

          {/* cascade */}
          <Typography variant="h4" sx={{ mt: 2 }}>
            Cascades
          </Typography>
          <TabContext value={cascadeDisplayed}>
            <Box>
              <TabList onChange={handleCascadeDisplayedChange}>
                {cascades.map((cascade) => (
                  <Tab
                    key={cascade.name}
                    label={cascade.title}
                    value={cascade.name}
                  />
                ))}
              </TabList>
            </Box>
            {cascades.map((cascade) => (
              <TabPanel
                sx={{ padding: 0 }}
                key={cascade.name}
                value={cascade.name}
              >
                <CascadeConfig cascade={cascade.cascade} />
              </TabPanel>
            ))}
          </TabContext>
        </Container>
        {snackbar ? (
          <SnackbarWithAlert
            snackbarData={snackbar}
            setSnackbar={setSnackbar}
          />
        ) : null}
      </EditableContentWrapper>
    </DashboardLayout>
  );
};

DashboardRecommenderSystemPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;
  const dateFrom = new Date(2023, 6, 1);
  const dateTo = new Date();

  const data: IRecommenderSystemProps = await dashboardStatsAPI(
    "GET",
    dateFrom,
    dateTo,
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("DATA", data);

  return {
    props: data,
  };
};
export default DashboardRecommenderSystemPage;
