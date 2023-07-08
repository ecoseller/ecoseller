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
  TODO
*/

interface IRecommenderSystemProps {
}

const DashboardRecommenderSystemPage = ({
}: IRecommenderSystemProps) => {

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {`Recommender System`}
        </Typography>
      </Container>
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

export default DashboardRecommenderSystemPage;
