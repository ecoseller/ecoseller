// next.js
// react
import React, { ReactElement, useState } from "react";
// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import RootLayout from "@/pages/layout";
// mui
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// components

export interface IInfomationProps {}

const Information = ({}: IInfomationProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const downIcon = <KeyboardArrowDownIcon />;
  const upIcon = <KeyboardArrowUpIcon />;
  const [icon, setIcon] = useState<JSX.Element>(downIcon);

  const handleExpandButtonClick = () => {
    setExpanded((prevExpanded) => {
      setIcon(prevExpanded ? downIcon : upIcon);
      return !prevExpanded;
    });
  };

  return (
    <Card
      sx={{
        p: 5,
        boxShadow: 0,
        color: (theme: any) => theme.palette["info"].darker,
        bgcolor: (theme: any) => theme.palette["info"].lighter,
      }}
    >
      <Typography
        variant={"h4"}
        sx={{ display: "inline", width: "fit-content" }}
      >
        Information
        <IconButton sx={{ float: "right" }} onClick={handleExpandButtonClick}>
          {icon}
        </IconButton>
      </Typography>
      <Box sx={{ display: expanded ? "block" : "none" }}>
        <Typography>Info</Typography>
      </Box>
    </Card>
  );
};

Information.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default Information;
