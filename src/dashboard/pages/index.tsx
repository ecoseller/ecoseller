// app/page.tsx

import { NextResponse } from "next/server";
import { ReactElement } from "react";
import RootLayout from "./layout";

const Page = () => {
  return <h1>Dashboard</h1>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout>{page}</RootLayout>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};

export default Page;
