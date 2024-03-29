// next
import dynamic from "next/dynamic";
// lib
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

interface ISummaryWidgetGraph {
  title: string;
  subheader: string;
  chartOptions?: any;
  chartData?: any[];
}

const SummaryWidgetGraph = ({
  title,
  subheader,
  chartOptions,
  chartData,
  ...other
}: ISummaryWidgetGraph) => {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData}
          options={chartOptions}
          height={350}
          width={"100%"}
        />
      </Box>
    </Card>
  );
};

export default SummaryWidgetGraph;
