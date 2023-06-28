import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { IAttributeSet, ICategoryDetail } from "@/types/category";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";
import Typography from "@mui/material/Typography";
import SubCategoryList from "@/components/Category/SubCategoryList";
import HeadMeta from "@/components/Common/SEO";
import { useRouter } from "next/router";
import ProductGrid from "@/components/Category/ProductGrid";
import { IAttributeTypeWithOptions, IProductRecord } from "@/types/product";
import { categoryProductsAPI } from "@/pages/api/category/[id]/products";
import { categoryDetailAPI } from "@/pages/api/category/[id]";
import Divider from "@mui/material/Divider";
import BreadcrumbCategoryNav from "@/components/Common/BreadcrumbCategoryNav";
import ProductFilters from "@/components/Category/ProductFilters";
import { ICountry } from "@/types/country";
import { countryDetailAPI } from "@/pages/api/country/[code]";
import { getCookie } from "cookies-next";
import { DEFAULT_COUNTRY } from "@/utils/defaults";
import React, { useEffect, useState } from "react";
import ProductSortSelect from "@/components/Category/ProductSortSelect";
import { getCategoryProducts } from "@/api/category/products";
import { categoryAttributesAPI } from "@/pages/api/category/[id]/attributes";

interface ICategoryPageProps {
  category: ICategoryDetail;
  products: IProductRecord[];
  countryCode: string;
  pricelist: string;
  attributes: IAttributeSet;
}

interface ITextualFilter extends IAttributeTypeWithOptions<string> {
  selectedValues: string[];
}

export interface IFilters {
  textual: { [key: number]: ITextualFilter };
}

const CategoryPage = ({
  category,
  products,
  countryCode,
  pricelist,
  attributes,
}: ICategoryPageProps) => {
  const router = useRouter();
  const { id } = router.query;

  const [productsState, setProductsState] = useState<IProductRecord[]>([]);
  const [filters, setFilters] = useState<IFilters>({ textual: {} });

  useEffect(() => {
    setProductsState(products);

    const emptyFilters: IFilters = { textual: {} };

    for (const attr of attributes.textual) {
      emptyFilters.textual[attr.id] = { ...attr, selectedValues: [] };
    }

    setFilters(emptyFilters);
  }, [id]);

  const sortProducts = (sortBy: string, order: string) => {
    getCategoryProducts(
      category.id,
      pricelist,
      countryCode,
      sortBy,
      order
    ).then((data) => {
      setProductsState(data);
    });
  };

  const updateFilter = (id: number, selectedValues: string[]) => {
    setFilters({
      ...filters,
      textual: {
        ...filters.textual,
        [id]: {
          ...filters.textual[id],
          selectedValues: selectedValues,
        },
      },
    });
  };

  return (
    <>
      <HeadMeta
        title={category.meta_title}
        description={category.meta_description}
        url={router.basePath}
      />
      <div className="container">
        <BreadcrumbCategoryNav breadcrumbs={category.breadcrumbs} />
        <Typography variant="h4" mt={3} gutterBottom>
          {category.title}
        </Typography>
        <EditorJsOutput data={category.description_editorjs} />
        {category.children.length > 0 ? (
          <>
            <SubCategoryList subCategories={category.children} />
            <Divider sx={{ my: 2 }} />
          </>
        ) : null}
        <ProductFilters filters={filters} updateFilter={updateFilter} />
        <Divider sx={{ my: 2 }} />
        <ProductSortSelect sortProducts={sortProducts} />
        <ProductGrid products={productsState} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, slug } = context.query;
  const { res, req, locale } = context;

  const language = Array.isArray(locale) ? locale[0] : locale || "en";
  let idNumber = Array.isArray(id) ? Number(id[0]) : Number(id) || null;

  if (!idNumber) {
    return {
      notFound: true,
    };
  }

  const country = getCookie("country", { req, res });

  const countryDetail: ICountry = await countryDetailAPI(
    "GET",
    country?.toString() || DEFAULT_COUNTRY,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const pricelist = countryDetail?.default_price_list;

  const category: ICategoryDetail = await categoryDetailAPI(
    idNumber.toString(),
    req as NextApiRequest,
    res as NextApiResponse
  );

  const products: IProductRecord[] = await categoryProductsAPI(
    idNumber.toString(),
    countryDetail.code,
    pricelist,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const attributes: IAttributeSet = await categoryAttributesAPI(
    idNumber.toString(),
    req as NextApiRequest,
    res as NextApiResponse
  );

  // if (!category) {
  //   return {
  //     notFound: true,
  //   };
  // } else if (data.slug && data.slug !== slug) {
  //   return {
  //     redirect: {
  //       destination: `/product/${id}/${data.slug}`,
  //       permanent: true,
  //     },
  //   };
  // }

  return {
    props: {
      category,
      products,
      countryCode: countryDetail.code,
      pricelist,
      attributes,
    },
  };
};

export default CategoryPage;
