import getConfig from "next/config";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const { serverRuntimeConfig } = getConfig();

const OrderItemComplaintCompletedPage = () => {
  const router = useRouter();
  const { t } = useTranslation(["order", "common"]);

  return (
    <div className="container">
      <Typography variant="h5" sx={{ my: 3 }}>
        {t("complaint-request-created")}
      </Typography>
      <div>{t("complaint-created-summary")}</div>
      <Button onClick={() => router.back()} sx={{ my: 3 }}>
        {t("common:back")}
      </Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "order",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default OrderItemComplaintCompletedPage;
