// /dashboard/overview

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// mui
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// components
import SummaryWidget from "@/components/Dashboard/Overview/SummaryWidget/SummaryWidget";
import SummaryWidgetGraph from "@/components/Dashboard/Overview/SummaryWidget/SummaryWidgetGraph";

const DashboardOverviewPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {`Today's order overview`}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Orders today"
              value={37}
              unit={""}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Revenue today"
              value={1850}
              unit={"€"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average order value"
              value={50}
              unit={"€"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Completed orders"
              value={3}
              unit={"%"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}>
          <SummaryWidgetGraph
            title={"Orders"}
            subheader={"Past 12 months"}
            chartData={[
              {
                name: "Orders",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 100, 80],
              },
            ]}
            chartOptions={{
              chart: {
                toolbar: {
                  show: false,
                },
                height: 350,
                width: 200,
                type: "line",
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "straight",
              },
              // title: {
              //   text: "Orders by past 12 months",
              //   align: "left",
              // },
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                  opacity: 0.5,
                },
              },
              xaxis: {
                categories: [
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                  "Jan",
                  "Feb",
                ],
              },
            }}
          />
        </Grid>
      </Container>
      <Container maxWidth="xl" sx={{ paddingTop: 8 }}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {`Today's recommender overview`}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Orders today"
              value={37}
              unit={""}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Revenue today"
              value={1850}
              unit={"€"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average order value"
              value={50}
              unit={"€"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Completed orders"
              value={3}
              unit={"%"}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}>
          <SummaryWidgetGraph
            title={"Recommendations"}
            subheader={"Past 12 months"}
            chartData={[
              {
                name: "Recommendations",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 120, 100, 80],
              },
            ]}
            chartOptions={{
              chart: {
                toolbar: {
                  show: false,
                },
                height: 350,
                width: 200,
                type: "line",
                zoom: {
                  enabled: false,
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "straight",
              },
              // title: {
              //   text: "Orders by past 12 months",
              //   align: "left",
              // },
              grid: {
                row: {
                  colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                  opacity: 0.5,
                },
              },
              xaxis: {
                categories: [
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                  "Jan",
                  "Feb",
                ],
              },
            }}
          />
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

DashboardOverviewPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Dashboard overview");
  return {
    props: {},
  };
};

export default DashboardOverviewPage;
