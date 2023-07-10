// next.js
import { useTranslation } from "next-i18next";
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import EASEConfigForm, { IEASEConfigProps } from "@/components/Dashboard/Recommender/EASEConfigForm";
import GRU4RecConfigForm, { IGRU4RecConfigProps } from "@/components/Dashboard/Recommender/GRU4RecConfigForm";
// mui
import { PermissionProvider } from "@/utils/context/permission";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Labeled from "@/components/Labeled";
import CascadeConfigForm from "@/components/Dashboard/Recommender/CascadeConfigForm";

export interface IRecommenderConfigFormProps {
  retrievalSize: number;
  orderingSize: number;
  homepageRetrievalCascade: string[];
  homepageScoringCascade: string[];
  categoryListScoringCascade: string[];
  productDetailRetrievalCascade: string[];
  productDetailScoringCascade: string[];
  cartRetrievalCascade: string[];
  cartScoringCascade: string[];
  easeConfig: IEASEConfigProps;
  gru4recConfig: IGRU4RecConfigProps;
}

const RecommenderConfigForm = ({
   retrievalSize,
   orderingSize,
   homepageRetrievalCascade,
   homepageScoringCascade,
   categoryListScoringCascade,
   productDetailRetrievalCascade,
   productDetailScoringCascade,
   cartRetrievalCascade,
   cartScoringCascade,
   easeConfig,
   gru4recConfig,
}: IRecommenderConfigFormProps) => {
  const { t } = useTranslation("recommender");
  
  return (
    <PermissionProvider allowedPermissions={[]}> {/*TODO: recommender edit permissions*/}
      <Typography variant="h4">
        {t("Configuration")}
      </Typography>
      <FormControl fullWidth margin={"normal"}>
        <Stack spacing={3}>

          <Labeled label={t("Retrieval size")}>
            <Input
              // disabled={!hasPermission}
              type="number"
              value={retrievalSize}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                
              }}
            />
          </Labeled>
          <Labeled label={t("Ordering size")}>
            <Input
              // disabled={!hasPermission}
              type="number"
              value={orderingSize}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                
              }}
            />
          </Labeled>

          <Typography variant="h6">
            {t("Cascade")}
          </Typography>
          <CascadeConfigForm title={t("Homepage retrieval")} models={homepageRetrievalCascade}/>
          <CascadeConfigForm title={t("Homepage scoring")} models={homepageScoringCascade}/>
          <CascadeConfigForm title={t("Category list scoring")} models={categoryListScoringCascade}/>
          <CascadeConfigForm title={t("Product detail retrieval")} models={productDetailRetrievalCascade}/>
          <CascadeConfigForm title={t("Product detail scoring")} models={productDetailScoringCascade}/>
          <CascadeConfigForm title={t("Cart retrieval")} models={cartRetrievalCascade}/>
          <CascadeConfigForm title={t("Cart scoring")} models={cartScoringCascade}/>

          <Typography variant="h6">
            {t("EASE")}
          </Typography>
          <EASEConfigForm {...easeConfig}/>

          <Typography variant="h6">
            {t("GRU4Rec")}
          </Typography>
          <GRU4RecConfigForm {...gru4recConfig}/>

        </Stack>
      </FormControl>
    </PermissionProvider>
  );
};

RecommenderConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default RecommenderConfigForm;
