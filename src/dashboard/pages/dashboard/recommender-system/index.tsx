// /dashboard/recommender-system

// layout
import DashboardLayout from "@/pages/dashboard/layout";
//react
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";
// mui
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// components
import { NextApiRequest, NextApiResponse } from "next";
import { dashboardStatsAPI } from "@/pages/api/recommender-system/dashboard";
import RecommenderConfigForm from "@/components/Dashboard/Recommender/RecommenderConfigForm";
import { IRecommenderConfigFormProps } from "@/components/Dashboard/Recommender/RecommenderConfigForm";

/*
Layout:
  TODO
*/

interface IRecommenderSystemProps {
  performance: any;
  training: any;
  config: IRecommenderConfigFormProps;
}

const DashboardRecommenderSystemPage = ({
  performance, training, config
}: IRecommenderSystemProps) => {
  
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {`Recommender System`}
        </Typography>
        <Typography variant="body1" sx={{ mb: 5 }}>
          {JSON.stringify(performance)}
        </Typography>
        <Typography variant="body1" sx={{ mb: 5 }}>
          {JSON.stringify(training)}
        </Typography>
        <RecommenderConfigForm {...config} />
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
