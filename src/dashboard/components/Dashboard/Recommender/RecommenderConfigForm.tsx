// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
import Labeled from "@/components/Labeled";
import { IEASEConfigProps } from "@/components/Dashboard/Recommender/EASEConfigForm";
import { IGRU4RecConfigProps } from "@/components/Dashboard/Recommender/GRU4RecConfigForm";
// mui
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";

export interface IRecommenderConfigEditableProps {
  retrievalSize: number;
  orderingSize: number;
}

export interface IRecommenderConfigFormProps {
  retrievalSize: number;
  orderingSize: number;
  onChange: (data: IRecommenderConfigEditableProps) => void;
}

export interface IRecommenderConfigProps {
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
  onChange,
}: IRecommenderConfigFormProps) => {
  const [retrievalSizeState, setRetrievalSizeState] =
    useState<number>(retrievalSize);
  const [orderingSizeState, setOrderingSizeState] =
    useState<number>(orderingSize);

  const handleStateChange = (data: object) => {
    const newData = {
      retrievalSize: retrievalSizeState,
      orderingSize: orderingSizeState,
      ...data,
    };
    setRetrievalSizeState(newData.retrievalSize);
    setOrderingSizeState(newData.orderingSize);
    onChange(newData);
  };

  return (
    <Box pl={3} py={2}>
      <Labeled label="Retrieval size">
        <Input
          type="number"
          value={retrievalSizeState}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            handleStateChange({ retrievalSize: parseInt(e.target.value) });
          }}
        />
      </Labeled>
      <Labeled label="Ordering size">
        <Input
          type="number"
          value={orderingSizeState}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            handleStateChange({ orderingSize: parseInt(e.target.value) });
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
