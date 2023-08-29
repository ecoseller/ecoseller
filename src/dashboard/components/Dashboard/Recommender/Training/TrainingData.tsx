// next.js
// react
import React, { ReactElement } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
// components

interface ITrainingDataItemProps {
  label: string;
  value: string | null;
  sx?: any;
}

const TrainingDataItem = ({ label, value, sx }: ITrainingDataItemProps) => {
  return (
    <Grid container p={1} sx={sx}>
      <Grid item xs={12} sm={8}>
        <Typography>{label}</Typography>
      </Grid>
      <Grid item xs={12} sm={4} textAlign={"right"}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );
};

interface ITrainingDataComposedItemProps {
  label: string;
  values: ITrainingDataItemProps[];
}

const TrainingDataComposedItem = ({
  label,
  values,
}: ITrainingDataComposedItemProps) => {
  return (
    <Grid container pl={1} pt={1} pb={1}>
      <Grid item xs={12}>
        <Typography>{label}</Typography>
      </Grid>
      {values.map((item, idx) => {
        const children = [
          <TrainingDataItem
            key={item.label}
            label={item.label}
            value={item.value}
          />,
        ];
        if (idx < values.length - 1) {
          children.push(<Divider />);
        }
        return (
          <Grid item xs={12} pl={3} key={item.label}>
            {children}
          </Grid>
        );
      })}
    </Grid>
  );
};

interface ITrainingsStatistics {
  started: number;
  completed: number;
  failed: number;
}

interface IValues {
  avg: number | null;
  max: number | null;
}

interface ITrainingDataDataProps {
  trainings: ITrainingsStatistics;
  peakMemory: IValues;
  peakMemoryPercentage: IValues;
  duration: IValues;
}

export interface ITrainingDataProps {
  data: ITrainingDataDataProps;
}

const TrainingData = ({ data }: ITrainingDataProps) => {
  const trainingStatisticsValues = [
    {
      label: "Started",
      value: `${data.trainings.started}`,
    },
    {
      label: "Completed",
      value: `${data.trainings.completed}`,
    },
    {
      label: "Failed",
      value: `${data.trainings.failed}`,
    },
  ];

  const parseValues = (data: IValues, unit: string) => {
    return [
      {
        label: "Average",
        value: data.avg !== null ? `${data.avg.toFixed(2)} ${unit}` : "unknown",
      },
      {
        label: "Maximum",
        value: data.max !== null ? `${data.max.toFixed(2)} ${unit}` : "unknown",
      },
    ];
  };
  const peakMemoryValues = parseValues(data.peakMemory, "MB");
  const peakMemoryPercentageValues = parseValues(
    data.peakMemoryPercentage,
    "%"
  );
  const durationValues = parseValues(data.duration, "s");

  return (
    <Box>
      <TrainingDataComposedItem
        label={`Number of trainings`}
        values={trainingStatisticsValues}
      />
      <Divider />

      <TrainingDataComposedItem label={`Duration`} values={durationValues} />
      <Divider />

      <TrainingDataComposedItem
        label={`Peak memory`}
        values={peakMemoryValues}
      />
      <Divider />

      <TrainingDataComposedItem
        label={`Peak memory percentage`}
        values={peakMemoryPercentageValues}
      />
    </Box>
  );
};

TrainingData.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default TrainingData;
