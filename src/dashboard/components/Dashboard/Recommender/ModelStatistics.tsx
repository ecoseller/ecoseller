// next.js
import { useTranslation } from "next-i18next";
// react
import React, {ReactElement, useEffect, useState} from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import Typography from "@mui/material/Typography";
import { IRecommenderConfigProps } from "@/components/Dashboard/Recommender/RecommenderConfigForm";
import { IStatisticsItemProps } from "@/components/Dashboard/Recommender/StatisticsItem";
import Training, { ITrainingProps } from "@/components/Dashboard/Recommender/Training";
import EASEConfigForm from "@/components/Dashboard/Recommender/EASEConfigForm";
import GRU4RecConfigForm from "@/components/Dashboard/Recommender/GRU4RecConfigForm";
import StatisticsItem from "@/components/Dashboard/Recommender/StatisticsItem";
// mui
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";


export interface IModelProps {
  name: string;
  title: string;
}

interface IModelTypePerformanceProps {
  name: string;
  title: string;
  item: IStatisticsItemProps;
}

export interface IModelPerformanceProps {
  k: number;
  name: string;
  item: IStatisticsItemProps;
  types: IModelTypePerformanceProps[];
}

export interface IModelStatisticsProps {
  model: IModelProps;
  globalConfig: IRecommenderConfigProps;
  performance?: IModelPerformanceProps;
  training?: ITrainingProps;
}

const ModelStatistics = ({
   model, performance, training, globalConfig
}: IModelStatisticsProps) => {
  const { t } = useTranslation("recommender");
  
  const [typeDisplayed, setTypeDisplayed] = useState<string>("");

  useEffect(() => {
    if (performance !== undefined) {
      setTypeDisplayed(performance.types[0].name);
    }
  }, [performance]);

  const handleTypeDisplayedChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTypeDisplayed(newValue);
  };
  
  return (
    <Box sx={{ pl: 3, py: 2 }}>
      {performance !== undefined &&
        <Box>
          <Typography variant="h6">
            {t("Performance")}
          </Typography>
          <StatisticsItem {...performance.item}/>
    
          <TabContext value={typeDisplayed}>
            <Box>
              <TabList
                onChange={handleTypeDisplayedChange}
              >
                {performance?.types.map((type) => (
                  <Tab
                    key={type.name}
                    label={type.title}
                    value={type.name}
                  />
                ))}
              </TabList>
            </Box>
            {performance?.types.map((type) => (
              <TabPanel
                sx={{ padding: 0 }}
                key={type.name}
                value={type.name}
              >
                <StatisticsItem {...type.item}/>
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      }

      <Typography variant="h6" sx={{ mt: 2 }}>
        {t("Latest training")}
      </Typography>
      {training === undefined || training.statistics === undefined ?
        <Typography variant="body1">
          {t("No training found.")}
        </Typography>
      :
        <Training {...training} />
      }
      
      {(model.name === "ease" || model.name === "gru4rec") &&
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("Model configuration")}
        </Typography>
      }
      {model.name === "ease" &&
        <EASEConfigForm {...globalConfig.easeConfig}/>
      }
      {model.name === "gru4rec" &&
        <GRU4RecConfigForm {...globalConfig.gru4recConfig}/>
      }
    </Box>
  );
};

ModelStatistics.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default ModelStatistics;
