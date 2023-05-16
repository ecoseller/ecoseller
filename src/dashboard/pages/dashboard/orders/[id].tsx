import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import { ReactElement } from "react";
import RootLayout from "@/pages/layout";

const OrderDetailPage = () => {
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <>Order detail</>
      </Container>
    </DashboardLayout>
  );
};

OrderDetailPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export const getServerSideProps = async (context: any) => {
  return { props: {} };
};

export default OrderDetailPage;
