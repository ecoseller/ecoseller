// app/login/index.tsx
import { ReactElement } from "react";
import RootLayout from "../layout";
import LoginLayout from "./layout";
import LoginBox from "@/components/Login/LoginBox";
import styles from "./login.module.scss";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

const LoginPage = () => {
  return (
    // <div className={styles.login_background}>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <div className={styles.login_container}>
          <LoginBox />
        </div>
      </Grid>
    </Grid>
  );
};

LoginPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <LoginLayout>{page}</LoginLayout>
    </RootLayout>
  );
};

export const getServersideProps = async (context: any) => {
  console.log("Login");
  return {
    props: {},
  };
};

export default LoginPage;
