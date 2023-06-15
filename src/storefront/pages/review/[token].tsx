// next
import { useRouter } from "next/router";
import Link from "next/link";

// react

// libs
import { productAPI } from "@/pages/api/product/[id]";
import Output from "@/utils/editorjs/Output";

// components
import MediaGallery from "@/components/ProductDetail/MediaGallery";
import ProductVariants from "@/components/ProductDetail/ProductVariants/Table";
import HeadMeta from "@/components/Common/SEO";
import ProductsSlider from "@/components/Common/ProductsSlider";

// mui
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

// types
import { IProduct, IProductSliderData } from "@/types/product";
import {
    GetServerSideProps,
    NextApiRequest,
    NextApiResponse,
} from "next/types";
import { orderItemsAPI } from "../api/order/items/[id]";

interface IReviewPageProps {
    items: string[];
}


const ReviewPage = () => {
    const { basePath } = useRouter();

    return (
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { token } = context.query;
    const { res, req, locale } = context;

    console.log(token);

    const data: IReviewPageProps = await orderItemsAPI(
        "GET",
        token as string,
        req as NextApiRequest,
        res as NextApiResponse,
    );

    console.log(data);

    // if (!data) {
    // } else if (data.slug && data.slug !== slug) {
    // }

    return {
        props: {
        },
    };
};

export default ReviewPage;
