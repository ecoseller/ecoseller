/**
 * This page serves as a catcher for CMS pages.
 * It's neccessary to control (in getServerSiderProps or getStaticProps) whether the page exists on backend or not.
 * if not, we can return 404 page.
 */

import { IPageCMS } from "@/types/cms";
import { GetServerSideProps } from "next";

interface CMSPageProps {
  page: IPageCMS;
}

const CMSPage = ({ page }: CMSPageProps) => {
  return (
    <>
      <h1>Page not found</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const { res, req, locale } = context;
  const language = Array.isArray(locale) ? locale[0] : locale || "en";
  // fetch page from backend

  // if page not found, return 404

  return {
    notFound: true,
  };
  // if page found, return page data
};

export default CMSPage;
