/**
 * /pages/index.tsx
 * This is the home page of the site
 */

// react
import React, { useEffect } from "react";
// next
import getConfig from "next/config";
import { GetServerSideProps } from "next";
// libraries
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// components
import Slider from "@/components/Slider/Slider";
// mui
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// styles
import styles from "@/styles/Homepage/Homepage.module.scss";
import Grid from "@mui/material/Grid";
import CompanyBenefit from "@/components/Homepage/CompanyBenefit";
import { IProductRecord, IProductSliderData } from "@/types/product";
import ProductsSlider from "@/components/Common/ProductsSlider";
import { useRecommender } from "@/utils/context/recommender";
import { useCountry } from "@/utils/context/country";

const { serverRuntimeConfig } = getConfig();

const HomePage = () => {
  const { t } = useTranslation("home");
  const [recommendedProducts, setRecommendedProducts] = React.useState<
    IProductRecord[]
  >([]);

  const { getRecommendations } = useRecommender();
  const { country } = useCountry();
  useEffect(() => {
    if (!country) return;
    // load recommended products
    getRecommendations("HOMEPAGE", {
      limit: 10,
      country: country?.code,
      pricelist: country?.default_price_list,
    }).then((products: any[]) => {
      setRecommendedProducts(products);
    });
  }, [country]);
  return (
    <div className={`container`}>
      <div className={styles.homePage}>
        <Slider />
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            {t("welcome-message-title") /* Welcome to our ecommerce store! */}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {
              t(
                "welcome-message-description"
              ) /* We offer a wide selection of products for all your needs. */
            }
          </Typography>
        </Box>
        <Box sx={{ pt: 5 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ sm: 3, md: 3, lg: 12 }}
          >
            <Grid item md={3}>
              <CompanyBenefit
                title={t("benefit-1-title")}
                subtitle={t("benefit-1-description")}
              />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit
                title={t("benefit-2-title")}
                subtitle={t("benefit-2-description")}
              />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit
                title={t("benefit-3-title")}
                subtitle={t("benefit-3-description")}
              />
            </Grid>
            <Grid item md={3}>
              <CompanyBenefit
                title={t("benefit-4-title")}
                subtitle={t("benefit-4-description")}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ pt: 5 }}>
          <Typography variant="h4" gutterBottom>
            {t("bestsellers-title") /* Best sellers */}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {
              t(
                "bestsellers-description"
              ) /* Check out our best selling products */
            }
          </Typography>
          <ProductsSlider data={recommendedProducts || []} />
        </Box>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        "home",
        "cookie",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default HomePage;
