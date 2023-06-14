import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import { IProduct } from "@/types/product";
import { productAPI } from "@/pages/api/product/[id]";
import { ICategoryDetail } from "@/types/category";
import { categoryDetailAPI } from "@/pages/api/category/[id]";
import EditorJsOutput from "@/utils/editorjs/EditorJsOutput";
import Typography from "@mui/material/Typography";
import SubCategoryList from "@/components/Category/SubCategoryList";
import HeadMeta from "@/components/Common/SEO";
import { useRouter } from "next/router";
import ProductList from "@/components/Category/ProductList";

interface ICategoryPageProps {
  category: ICategoryDetail;
}

const CategoryPage = ({ category }: ICategoryPageProps) => {
  const router = useRouter();

  return (
    <>
      <HeadMeta
        title={category.meta_title}
        description={category.meta_description}
        url={router.basePath}
      />
      <div className="container">
        <Typography variant="h4">{category.title}</Typography>
        <EditorJsOutput data={category.description_editorjs} />
        {category.children.length > 0 ? (
          <SubCategoryList subCategories={category.children} />
        ) : null}
        <ProductList />
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

  const category: ICategoryDetail = await categoryDetailAPI(
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
    },
  };
};

export default CategoryPage;
