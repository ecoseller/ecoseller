// next
import dynamic from "next/dynamic";
// lib
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
// import ReactApexChart from "react-apexcharts";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

interface ISummaryWidgetGraphOrders {
  title: string;
  subheader: string;
  chartOptions?: any;
  chartData?: any[];
}

const SummaryWidgetGraphOrders = ({
  title,
  subheader,
  chartOptions,
  chartData,
  ...other
}: ISummaryWidgetGraphOrders) => {
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

export default SummaryWidgetGraphOrders;
