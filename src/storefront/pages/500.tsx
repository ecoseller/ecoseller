// utils
import { Typography } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

const Custom500Page = () => {
  const { t } = useTranslation("error");
  return (
    <div className="container">
      <Typography>{t("500")}</Typography>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "error",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
    revalidate: 60,
  };
};
export default Custom500Page;
