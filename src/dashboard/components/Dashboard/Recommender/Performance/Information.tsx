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
import { IInfo } from "@/pages/dashboard/recommender-system/configuration";
import Divider from "@mui/material/Divider";

// components

export interface IInfomationProps {
  k: number;
  info: IInfo;
}

const Information = ({ k, info }: IInfomationProps) => {
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

  const infoElements: JSX.Element[] = [];
  Object.values(info).map((item, idx) => {
    infoElements.push(
      <Box sx={{ p: 1 }}>
        <Typography variant={"h6"} sx={{ mb: 1 }}>
          {item.title.replace("%k%", `${k}`)}
        </Typography>
        <Typography>{item.description.replace("%k%", `${k}`)}</Typography>
      </Box>
    );
    if (idx < Object.keys(info).length - 1) {
      infoElements.push(<Divider sx={{ m: 1 }} />);
    }
  });

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
      <Box sx={{ display: expanded ? "block" : "none" }}>{infoElements}</Box>
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
