// next.js
import { useTranslation } from "next-i18next";
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import Labeled from "@/components/Labeled";
// mui
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

export interface IConfigFormProps {
  retrievalSize: number;
  orderingSize: number;
}

const RecommenderConfigForm = ({
   retrievalSize,
   orderingSize,
}: IConfigFormProps) => {
  const { t } = useTranslation("recommender");
  
  return (
      <Box pl={3} py={2}>

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

      </Box>
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
