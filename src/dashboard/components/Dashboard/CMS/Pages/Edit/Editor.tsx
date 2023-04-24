import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import { IPageCMS, IPageFrontend } from "@/types/cms";
import Grid from "@mui/material/Grid";
import { useReducer, useState } from "react";
import PageCMSForm from "./CMS/PageCMSForm";
import PageFrontendForm from "./Storefront/PageStorefrontForm";

interface IPageEditorWrapperProps {
  storefrontPageData?: IPageFrontend;
  cmsPageData?: IPageCMS;
}

const PageEditorWrapper = ({
  storefrontPageData,
  cmsPageData,
}: IPageEditorWrapperProps) => {
  return (
    <>
      {cmsPageData ? (
        <PageCMSForm CMSPageData={cmsPageData} />
      ) : storefrontPageData ? (
        <PageFrontendForm storefrontPageData={storefrontPageData} />
      ) : null}
    </>
  );
};

export default PageEditorWrapper;
