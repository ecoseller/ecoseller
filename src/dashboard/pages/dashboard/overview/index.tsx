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
import { orderStatsListTodayAPI } from "@/pages/api/order/today";
import { NextApiRequest, NextApiResponse } from "next";
import { orderStatsListMonthAPI } from "@/pages/api/order/month";
import { IOrderStats } from "@/types/order";
import { Card, Stack } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import StyledIcon from "@/components/Dashboard/Overview/SummaryWidget/SummaryWidget";
import imgPath from "@/utils/imgPath";
import ImageThumbnail from "@/components/Dashboard/Generic/ImageThumbnail";

/*
Layout:
  Todays overview:
    - Orders today
    - Revenue today
    - Average order value
    - Average items per order
    - Top selling product today
  Past 30 days:
    - Orders
    - Revenue
    - Average order value
    - Average items per order
    - Top 5 selling products
*/

interface IOverviewProps {
  ordersTodayStats: IOrderStats;
  ordersMonthStats: IOrderStats;
}

const DashboardOverviewPage = ({
  ordersTodayStats,
  ordersMonthStats,
}: IOverviewProps) => {
  console.log("STATS TODAY", ordersTodayStats);
  console.log("STATS MONTH", ordersMonthStats);

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
              value={ordersTodayStats.orders_count}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Revenue today"
              value={ordersTodayStats.revenue}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average order value"
              value={ordersTodayStats.average_order_value}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average items per order"
              value={ordersTodayStats.average_items_per_order}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={15} sm={9} md={6}>
            <Card
              sx={{
                py: 5,
                boxShadow: 0,
                textAlign: "center",
                color: (theme: any) => theme.palette["info"].darker,
                bgcolor: (theme: any) => theme.palette["info"].lighter,
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                {`Top selling product today`}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <div
                  style={{
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    width: "200px",
                    height: "100%",
                    flexShrink: 0,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ImageThumbnail
                    imagePath={
                      ordersTodayStats.top_selling_products == null
                        ? ""
                        : imgPath(
                          ordersTodayStats.top_selling_products[0]?.media,
                          true
                        )
                    }
                    alt={""}
                  />
                </div>
                <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                  {ordersTodayStats.top_selling_products == null
                    ? ""
                    : ordersTodayStats.top_selling_products[0]?.title}
                </p>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        <Stack spacing={3} sx={{ mt: 5 }}></Stack>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {`Order review past 30 days`}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Orders count"
              value={ordersMonthStats.orders_count}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Revenue"
              value={ordersMonthStats.revenue}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average order value"
              value={ordersMonthStats.average_order_value}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average items per order"
              value={ordersMonthStats.average_items_per_order}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
          <Grid item xs={15} sm={9} md={6}>
            <Card
              sx={{
                py: 5,
                boxShadow: 0,
                textAlign: "center",
                color: (theme: any) => theme.palette["info"].darker,
                bgcolor: (theme: any) => theme.palette["info"].lighter,
              }}
            >
              <Typography variant="h6" sx={{ mb: 5 }}>
                {`Top selling products past 30 days`}
              </Typography>
              {ordersMonthStats.top_selling_products &&
                ordersMonthStats.top_selling_products.map((product: any) => (
                  <Stack
                    key={product.id}
                    direction="row"
                    justifyContent="left"
                    alignItems="left"
                    spacing={2}
                  >
                    <div
                      style={{
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        paddingLeft: "50px",
                        width: "200px",
                        height: "100%",
                        flexShrink: 0,
                        position: "relative",
                        display: "flex",
                        alignItems: "left",
                      }}
                    >
                      <ImageThumbnail
                        imagePath={imgPath(product.media, true)}
                        alt={""}
                      />
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {product.title}
                    </p>
                  </Stack>
                ))}
            </Card>
          </Grid>
          <Grid item xs={12} sm={9} md={3}></Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={8} sx={{ paddingTop: 2 }}>
          <SummaryWidgetGraph
            title={"Orders"}
            subheader={"Past 30 days"}
            chartData={[
              {
                name: "Orders",
                data: ordersMonthStats.daily_orders_count,
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
                categories: Array.from(Array(30).keys()).map((i) => i + 1),
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
              value={ordersMonthStats.average_order_value}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Revenue today"
              value={ordersMonthStats.revenue}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Average order value"
              value={ordersMonthStats.average_order_value}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Completed orders"
              value={ordersMonthStats.average_order_value}
              color="info"
              icon={<ShoppingBagIcon sx={{ fontSize: 40 }} />}
            />
          </Grid>
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

export const getServerSideProps = async (context: any) => {
  const { req, res } = context;

  const ordersTodayStats: IOrderStats = await orderStatsListTodayAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  const ordersMonthStats: IOrderStats = await orderStatsListMonthAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  console.log("STATS TODAY SERVER", ordersTodayStats);
  console.log("STATS MONTH SERVER", ordersMonthStats);

  return {
    props: {
      ordersTodayStats,
      ordersMonthStats,
    },
  };
};

export default DashboardOverviewPage;
