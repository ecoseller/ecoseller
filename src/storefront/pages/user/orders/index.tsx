import { useRouter } from "next/router";
import getConfig from "next/config";
import { useState } from "react";
import { Container } from "@mui/material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { useSnackbarState } from "@/utils/snackbar";
import { OrderList } from "@/components/Common/OrdersList";
import { userOrdersAPI } from "@/pages/api/user/orders";
import { IOrderBasicInfo } from "@/types/order";
import { orderItemsAPI } from "@/pages/api/order/items/[id]";

const { serverRuntimeConfig } = getConfig();
interface IUserOrdersProps {
  orders: IOrderBasicInfo[];
}

const StorefrontUserEditPage = ({ orders }: IUserOrdersProps) => {
  const router = useRouter();

  const [state, setState] = useState<IUserOrdersProps>({ orders });
  console.log("Orders", state);

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useSnackbarState();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const showSnackbar = (
    res: Response,
    messageSuccess: string,
    messageError: string
  ) => {
    if (!res?.ok) {
      setSnackbar({
        open: true,
        message: messageError,
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: messageSuccess,
        severity: "success",
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <OrderList orders={orders} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, locale } = context;

  const orders = await userOrdersAPI(
    "GET",
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (orders?.length != 0) {
    for (const order of orders) {
      order.items = [];
      const items = await orderItemsAPI(
        "GET",
        order.token,
        req as NextApiRequest,
        res as NextApiResponse
      );
      if (items?.length != 0) {
        for (const item of items.items) {
          order.items.push(item.product_variant_name);
        }
      }
    }
  }

  return {
    props: {
      orders: orders,
      ...(await serverSideTranslations(locale as string, [
        "order",
        "user",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default StorefrontUserEditPage;
