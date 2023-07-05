// utils
import { useTranslation } from "next-i18next";

const OrderCompleted = ({ id }: { id: string }) => {
  const { t } = useTranslation("order");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <h1>{t("thank-you-title")}</h1>
      <h3>
        {
          t(
            "thank-you-descripiton"
          ) /* We sent you an e-mail with order confirmation. */
        }
      </h3>
    </div>
  );
};

export default OrderCompleted;
