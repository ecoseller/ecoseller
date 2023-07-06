import { IOrderWithPayment } from "@/types/order";
import Stack from "@mui/material/Stack";
import React from "react";
import PaperItem from "@/components/Generic/PaperItem";
import { useTranslation } from "next-i18next";

interface IOrderDetailsProps {
  orderWithPayment: IOrderWithPayment;
}

const OrderDetails = ({ orderWithPayment }: IOrderDetailsProps) => {
  const { t } = useTranslation(["order", "common"]);

  const isPaid = orderWithPayment.payment != null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ my: 3 }}>
      <PaperItem>
        {t("status")}: {t(`order-status-${orderWithPayment.order.status}`)}
      </PaperItem>
      <PaperItem>
        {t("created-at", {
          ns: "common",
          date: orderWithPayment.order.create_at,
        })}
      </PaperItem>
      <PaperItem>{isPaid ? t("paid") : t("waiting-for-payment")}</PaperItem>
    </Stack>
  );
};

export default OrderDetails;
