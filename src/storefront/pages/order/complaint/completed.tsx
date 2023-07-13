// libs
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";
import { useTranslation } from "next-i18next";
// utils
import OrderCompleted from "@/components/Order/OrderCompleted";
import OnlinePayment from "@/components/Order/Payment/Online";
import PayBySquare from "@/components/Order/Payment/PayBySquare";
import { orderDetailAPI } from "@/pages/api/order/[id]";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const { serverRuntimeConfig } = getConfig();

const OrderItemComplaintCompletedPage = () => {
  const router = useRouter();
  return (
    <div className="container">
      <Typography variant="h5" sx={{ my: 3 }}>
        Request created
      </Typography>
      <div>Confirmation mail has been sent.</div>
      <Button onClick={() => router.back()}>Back</Button>
    </div>
  );
};

export default OrderItemComplaintCompletedPage;
