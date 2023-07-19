import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import getConfig from "next/config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import {
  IAttributeSet,
  ICategoryDetail,
  INumericFilter,
  ISelectedFiltersWithOrdering,
  ISelectedFiltersWithOrderingToSend,
  ITextualFilter,
} from "@/types/category";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";
import Typography from "@mui/material/Typography";
import SubCategoryList from "@/components/Category/SubCategoryList";
import HeadMeta from "@/components/Common/SEO";
import { useRouter } from "next/router";
import ProductGrid from "@/components/Category/ProductGrid";
import { IPaginatedProductRecord, IProductRecord } from "@/types/product";
import { IAttributeTypeWithOptions } from "@/types/attributes";
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
import { categoryAttributesAPI } from "@/pages/api/category/[id]/attributes";
import { filterProducts } from "@/api/category/products";
import { useRecommender } from "@/utils/context/recommender";
import PaginationWrapper from "@/components/Category/Pagination";

const { serverRuntimeConfig } = getConfig();
const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

interface ICategoryPageProps {
  category: ICategoryDetail;
  products: IPaginatedProductRecord;
  countryCode: string;
  pricelist: string;
  attributes: IAttributeSet;
}

interface ITextualAttributeFilterWithOptions
  extends IAttributeTypeWithOptions<string>,
    ITextualFilter {}

export interface INumericAttributeFilterWithOptions
  extends IAttributeTypeWithOptions<number>,
    INumericFilter {}

export interface IFilters {
  textual: { [id: number]: ITextualAttributeFilterWithOptions };
  numeric: { [id: number]: INumericAttributeFilterWithOptions };
}

interface IFiltersWithOrdering {
  filters: IFilters;
  sortBy: string | null;
  order: string | null;
}

export enum NumericFilterValueType {
  Min,
  Max,
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
  const { session } = useRecommender();

  const initialFilters: IFiltersWithOrdering = {
    filters: {
      textual: {},
      numeric: {},
    },
    sortBy: null,
    order: null,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [productsState, setProductsState] = useState<IProductRecord[]>([]);
  const [categoryPage, setCategoryPage] = useState<number>(1);
  const [categoryTotalPages, setCategoryTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<IFiltersWithOrdering>(initialFilters);

  const hasAnyAttributes =
    attributes.numeric.length > 0 || attributes.textual.length > 0;

  useEffect(() => {
    if (filters != initialFilters) {
      setCategoryPage(1);
      applyFilters();
    }
  }, [filters]);

  useEffect(() => {
    if (categoryPage >= 1) {
      if (isBrowser()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (filters != initialFilters) {
        applyFilters();
      }
    }
  }, [categoryPage]);

  useEffect(() => {
    setProductsState(products?.results);
    setCategoryTotalPages(products?.total_pages);

    const storedFilters = tryLoadFiltersFromSessionStorage();
    if (storedFilters == null) {
      setEmptyFilters();
    } else {
      setFilters(storedFilters);
    }
  }, [id]);

  const getFiltersStorageKey = () => `category-${category.id}-filters`;

  const saveFiltersToSessionStorage = () => {
    sessionStorage.setItem(getFiltersStorageKey(), JSON.stringify(filters));
  };

  const tryLoadFiltersFromSessionStorage = () => {
    const filtersString = sessionStorage.getItem(getFiltersStorageKey());

    if (filtersString == null) {
      return null;
    } else {
      return JSON.parse(filtersString) as IFiltersWithOrdering;
    }
  };

  const setEmptyFilters = () => {
    const emptyFilters = { ...initialFilters };

    for (const attr of attributes.textual) {
      emptyFilters.filters.textual[attr.id] = {
        ...attr,
        selected_values_ids: [],
      };
    }

    for (const attr of attributes.numeric) {
      emptyFilters.filters.numeric[attr.id] = {
        ...attr,
        min_value_id: null,
        max_value_id: null,
      };
    }

    setFilters(emptyFilters);
  };

  const getNumericFilterSelectedValues = (
    filter: INumericAttributeFilterWithOptions,
    min_value_id: number | null,
    max_value_id: number | null
  ) => {
    const min_value = min_value_id
      ? filter.possible_values.find((v) => v.id == min_value_id)?.value ||
        Number.NEGATIVE_INFINITY
      : Number.NEGATIVE_INFINITY;
    const max_value = max_value_id
      ? filter.possible_values.find((v) => v.id == max_value_id)?.value ||
        Number.POSITIVE_INFINITY
      : Number.POSITIVE_INFINITY;

    return filter.possible_values
      .filter((v) => v.value >= min_value && v.value <= max_value)
      .map((v) => v.id);
  };

  const applyFilters = () => {
    setLoading(true);
    const filtersToApply: ISelectedFiltersWithOrdering = {
      filters: {
        numeric: Object.values(filters.filters.numeric),
        textual: Object.values(filters.filters.textual),
      },
      sort_by: filters.sortBy,
      order: filters.order,
    };

    saveFiltersToSessionStorage();

    // transform the numeric filters
    const filtersToSend: ISelectedFiltersWithOrderingToSend = {
      filters: {
        textual: filtersToApply.filters.textual,
        numeric: [],
      },
      sort_by: filtersToApply.sort_by,
      order: filtersToApply.order,
    };

    for (const f of filtersToApply.filters.numeric) {
      const filter = filters.filters.numeric[f.id];
      const transformedFilter: ITextualFilter = {
        id: f.id,
        selected_values_ids: [],
      };

      transformedFilter.selected_values_ids = getNumericFilterSelectedValues(
        filter,
        f.min_value_id,
        f.max_value_id
      );

      filtersToSend.filters.numeric.push(transformedFilter);
    }

    filterProducts(
      category.id,
      pricelist,
      countryCode,
      filtersToSend,
      categoryPage,
      session
    ).then((products) => {
      setProductsState(products?.results);
      setCategoryTotalPages(products?.total_pages);
      setLoading(false);
    });
  };

  const sortProducts = (sortBy: string, order: string) => {
    setFilters({
      ...filters,
      sortBy: sortBy,
      order: order,
    });
  };

  const updateTextualFilter = (id: number, selectedValuesIds: number[]) => {
    setFilters({
      ...filters,
      filters: {
        ...filters.filters,
        textual: {
          ...filters.filters.textual,
          [id]: {
            ...filters.filters.textual[id],
            selected_values_ids: selectedValuesIds,
          },
        },
      },
    });
  };

  const updateNumericFilter = (
    id: number,
    valueType: NumericFilterValueType,
    valueId: number | null
  ) => {
    if (valueType == NumericFilterValueType.Min) {
      setFilters({
        ...filters,
        filters: {
          ...filters.filters,
          numeric: {
            ...filters.filters.numeric,
            [id]: {
              ...filters.filters.numeric[id],
              min_value_id: valueId,
            },
          },
        },
      });
    } else {
      setFilters({
        ...filters,
        filters: {
          ...filters.filters,
          numeric: {
            ...filters.filters.numeric,
            [id]: {
              ...filters.filters.numeric[id],
              max_value_id: valueId,
            },
          },
        },
      });
    }
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
        {hasAnyAttributes ? (
          <ProductFilters
            filters={filters.filters}
            updateTextualFilter={updateTextualFilter}
            updateNumericFilter={updateNumericFilter}
            setEmptyFilters={setEmptyFilters}
          />
        ) : null}
        <Divider sx={{ my: 2 }} />
        <ProductSortSelect
          defaultOrdering={filters}
          sortProducts={sortProducts}
        />
        <ProductGrid products={productsState} loading={loading} />
        <PaginationWrapper
          currentPage={categoryPage}
          totalPageCount={categoryTotalPages}
          setPage={(page: number) => {
            setCategoryPage(page);
          }}
        />
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

  const rsSession = (getCookie("rsSession", { req, res }) as string) || "";

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
    "GET",
    idNumber.toString(),
    countryDetail.code,
    pricelist,
    "1",
    rsSession,
    req as NextApiRequest,
    res as NextApiResponse
  );

  const attributes: IAttributeSet = await categoryAttributesAPI(
    idNumber.toString(),
    req as NextApiRequest,
    res as NextApiResponse
  );

  if (!category) {
    return {
      notFound: true,
    };
  } else if (category.slug && category.slug !== slug) {
    return {
      redirect: {
        destination: `/category/${id}/${category.slug}`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      category,
      products,
      countryCode: countryDetail.code,
      pricelist,
      attributes,
      ...(await serverSideTranslations(locale as string, [
        "category",
        ...serverRuntimeConfig.commoni18NameSpaces,
      ])),
    },
  };
};

export default CategoryPage;
