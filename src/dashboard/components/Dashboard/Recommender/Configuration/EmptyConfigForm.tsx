// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// components
// mui
import Typography from "@mui/material/Typography";

interface IEmptyConfigProps {
  name: string;
}

const EmptyConfigForm = ({ name }: IEmptyConfigProps) => {
  return (
    <Typography>{`${name} model has no configurable parameters.`}</Typography>
  );
};

EmptyConfigForm.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default EmptyConfigForm;
