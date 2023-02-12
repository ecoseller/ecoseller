// app/page.tsx

import { ReactElement } from "react";
import RootLayout from "./layout";

const Page = () => {
  return <h1>Dashboard</h1>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <RootLayout>
      {page}
    </RootLayout>
  )
}

export default Page;
