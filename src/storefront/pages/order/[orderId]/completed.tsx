// utils
import { useTranslation } from "next-i18next";
import OrderCompleted from "@/components/Order/OrderCompleted";
import OnlinePayment from "@/components/Order/Payment/Online";
import PayBySquare from "@/components/Order/Payment/PayBySquare";
import { orderDetailAPI } from "@/pages/api/order/[id]";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

interface IOrderCompletedPageProps {
  orderId: string;
  orderData: {
    order: any;
    payment?: {
      payment_type: string;
      status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
      data: any;
    };
  };
}

const OrderCompletedPage = ({
  orderId,
  orderData,
}: IOrderCompletedPageProps) => {
  const { t } = useTranslation("order");
  console.log("orderData", orderData);
  if (!orderData?.payment) {
    // doesn't have payment data
    return <OrderCompleted id={orderId} />;
  }
  if (orderData?.payment?.status == "PAID") {
    return (
      <>
        <OrderCompleted id={orderId} />
        <h2>
          {t("completed-text") /* Payment has been received. Thank you. */}
        </h2>
      </>
    );
  }
  // it's not yet paid

  return (
    <>
      <OrderCompleted id={orderId} />
      {orderData?.payment?.data?.payment_type == "PayBySquareMethod" ? (
        <PayBySquare {...orderData?.payment?.data} />
      ) : orderData?.payment?.data?.payment_type == "OnlinePaymentMethod" ? (
        <OnlinePayment {...orderData?.payment?.data} />
      ) : null}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const { orderId } = context.query;

  const orderData = await orderDetailAPI(
    "GET",
    orderId as string,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return {
    props: {
      orderId,
      orderData,
    },
  };
};

export default OrderCompletedPage;
