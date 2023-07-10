// pages/dashboard/layout.tsx

// react
import { ReactNode, useState } from "react";
// components
import DashboardHeader from "@/components/Dashboard/Header";
import DashboardNav from "@/components/Dashboard/Nav";
// mui
import { styled, ThemeProvider } from "@mui/material/styles";

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  minHeight: "100%",
  paddingTop: 40,
  paddingLeft: theme.spacing(0.5),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: 60,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  backgroundColor: "#F6F8FA",
}));

const DashboardLayout = ({
  children, // will be a page or nested layout
}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <DashboardHeader onOpenNav={() => setOpen(true)} />
      <DashboardNav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main>{children}</Main>
    </StyledRoot>
  );
};

export default DashboardLayout;
