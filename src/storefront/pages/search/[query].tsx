import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { ICategoryDetail } from "@/types/category";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";
import Typography from "@mui/material/Typography";
import SubCategoryList from "@/components/Category/SubCategoryList";
import HeadMeta from "@/components/Common/SEO";
import { useRouter } from "next/router";
import ProductGrid from "@/components/Category/ProductGrid";
import { IProductRecord } from "@/types/product";
import { categoryProductsAPI } from "@/pages/api/category/[id]/products";
import { categoryDetailAPI } from "@/pages/api/category/[id]";
import Divider from "@mui/material/Divider";
import BreadcrumbCategoryNav from "@/components/Common/BreadcrumbCategoryNav";
import ProductFilters from "@/components/Category/ProductFilters";
import { ICountry } from "@/types/country";
import { countryDetailAPI } from "@/pages/api/country/[code]";
import { getCookie } from "cookies-next";
import { DEFAULT_COUNTRY } from "@/utils/defaults";
import { searchProductsAPI } from "../api/search/[query]";

interface ISearchPageProps {
  search: {
    query: string;
  };
  products: IProductRecord[];
}

const SearchPage = ({ search, products }: ISearchPageProps) => {
  const router = useRouter();

  console.log("products", products);

  return (
    <>
      <HeadMeta
        title={`Search: ${search.query}`}
        description={""}
        url={router.basePath}
      />
      <div className="container">
        <Typography variant="h4" mt={3} gutterBottom>
          {search.query}
        </Typography>
        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <Typography variant="body1" mt={3} gutterBottom>
            No products found
          </Typography>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context.query;
  const { res, req, locale } = context;

  const language = Array.isArray(locale) ? locale[0] : locale || "en";
  let queryString = Array.isArray(query) ? query[0] : query || "";

  const country = getCookie("country", { req, res });

  const countryDetail: ICountry = await countryDetailAPI(
    "GET",
    country?.toString() || DEFAULT_COUNTRY,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const pricelist = countryDetail?.default_price_list;

  const products: IProductRecord[] = await searchProductsAPI(
    queryString,
    countryDetail.code,
    pricelist,
    language,
    req as NextApiRequest,
    res as NextApiResponse
  ).catch((err) => {
    console.log("err", err);
    return [];
  });

  return {
    props: {
      search: {
        query: query,
      },
      products,
    },
  };
};

export default SearchPage;
