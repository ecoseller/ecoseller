// next

// react

// libs
import { productAPI } from "@/pages/api/product/[id]";
import Output from "@/utils/editorjs/Output";

// components
import MediaGallery from "@/components/ProductDetail/MediaGallery";

// mui

// types
import { IProduct } from "@/types/product";
import {
  GetServerSideProps,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import ProductVariants from "@/components/ProductDetail/ProductVariants";
import HeadMeta from "@/components/Common/SEO";
import { useRouter } from "next/router";
interface IProductPageProps {
  data: IProduct;
}

const ProductPage = ({ data }: IProductPageProps) => {
  const { basePath } = useRouter();

  return (
    <>
      <HeadMeta
        title={data.meta_title}
        description={data.meta_description}
        url={basePath}
      />
      <div className={`container`}>
        <h1>{data.title}</h1>
        <MediaGallery media={data.media} />
        <ProductVariants variants={data.product_variants} />
        <Output data={data.description_editorjs} />
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

  const data: IProduct = await productAPI(
    idNumber,
    req as NextApiRequest,
    res as NextApiResponse,
    language
  );

  console.log(data);

  if (!data) {
    return {
      notFound: true,
    };
  } else if (data.slug && data.slug !== slug) {
    return {
      redirect: {
        destination: `/product/${id}/${data.slug}`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      data,
    },
  };
};

export default ProductPage;
