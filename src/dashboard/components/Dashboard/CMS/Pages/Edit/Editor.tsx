// next

// react

// libs

// components
import PageFrontendForm from "./Storefront/PageStorefrontForm";
import PageCMSForm from "./CMS/PageCMSForm";

// mui

// types
import { IPageCMS, IPageFrontend } from "@/types/cms";

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
