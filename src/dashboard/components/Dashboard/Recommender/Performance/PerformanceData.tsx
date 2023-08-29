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

interface IPerformanceDataItemProps {
  label: string;
  value: string | null;
  sx?: any;
}

const PerformanceDataItem = ({
  label,
  value,
  sx,
}: IPerformanceDataItemProps) => {
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

interface IPerformanceDataComposedItemProps {
  label: string;
  values: IPerformanceDataItemProps[];
}

const PerformanceDataComposedItem = ({
  label,
  values,
}: IPerformanceDataComposedItemProps) => {
  return (
    <Grid container pl={1} pt={1} pb={1}>
      <Grid item xs={12}>
        <Typography>{label}</Typography>
      </Grid>
      {values.map((item, idx) => {
        const children = [
          <PerformanceDataItem
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

interface IDurationValues {
  avg: number | null;
  max: number | null;
}

interface IPerformanceDataDataProps {
  hitRate: number | null;
  futureHitRate: number | null;
  coverage: number | null;
  predictions: number | null;
  retrievalDuration: IDurationValues;
  scoringDuration: IDurationValues;
}

export interface IPerformanceDataProps {
  k: number;
  data: IPerformanceDataDataProps;
}

const PerformanceData = ({ k, data }: IPerformanceDataProps) => {
  const parseDurationValues = (data: IDurationValues) => {
    return [
      {
        label: "Average",
        value: data.avg !== null ? `${data.avg.toFixed(4)} s` : "unknown",
      },
      {
        label: "Maximum",
        value: data.max !== null ? `${data.max.toFixed(4)} s` : "unknown",
      },
    ];
  };
  const retrievalDurationValues = parseDurationValues(data.retrievalDuration);
  const scoringDurationValues = parseDurationValues(data.scoringDuration);

  return (
    <Box>
      <PerformanceDataItem
        label={`Hit rate @ ${k}`}
        value={
          data.hitRate !== null ? `${data.hitRate.toFixed(4)} %` : "unknown"
        }
      />
      <Divider />

      <PerformanceDataItem
        label={`Future hit rate @ ${k}`}
        value={
          data.futureHitRate !== null
            ? `${data.futureHitRate.toFixed(4)} %`
            : "unknown"
        }
      />
      <Divider />

      <PerformanceDataItem
        label={`Coverage`}
        value={
          data.coverage !== null ? `${data.coverage.toFixed(4)} %` : "unknown"
        }
      />
      <Divider />

      <PerformanceDataItem
        label={`Number of predictions`}
        value={data.predictions !== null ? `${data.predictions}` : "unknown"}
      />
      <Divider />

      <PerformanceDataComposedItem
        label={`Retrieval duration`}
        values={retrievalDurationValues}
      />
      <Divider />

      <PerformanceDataComposedItem
        label={`Scoring duration`}
        values={scoringDurationValues}
      />
    </Box>
  );
};

PerformanceData.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default PerformanceData;
