/**
 * This page serves as a catcher for CMS pages.
 * It's neccessary to control (in getServerSiderProps or getStaticProps) whether the page exists on backend or not.
 * if not, we can return 404 page.
 */

import { IPageCMS } from "@/types/cms";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { pageCMSAPI } from "./api/cms/[locale]/[slug]";
import { Box, Typography } from "@mui/material";
import { FontDownload } from "@mui/icons-material";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";

interface CMSPageProps {
  page: IPageCMS;
}

const CMSPage = ({ page }: CMSPageProps) => {
  return (
    <div className="container">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 2,
          mt: 4,
          fontWeight: 700,
        }}
      >
        {page.title}
      </Typography>
      <Box sx={{ pt: 5, pl: 3 }}>
        <EditorJsOutput data={page.content} />
      </Box>
      <Box
        sx={{
          mt: 5,
        }}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const { res, req, locale } = context;
  const language = Array.isArray(locale) ? locale[0] : locale || "en";

  // fetch page from backend
  const page = await pageCMSAPI(
    "GET",
    language,
    slug as string,
    req as NextApiRequest,
    res as NextApiResponse
  )
    .then((data) => data)
    .catch((error) => null);

  // if page not found, return 404
  if (page == undefined || page == null || page?.message == "page not found") {
    return {
      notFound: true,
    };
  }

  // if page found, return page data
  return {
    props: {
      page,
    },
  };
};

export default CMSPage;
