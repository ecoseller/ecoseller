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
import { Container } from "@mui/material";
import { useState } from "react";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Generic/EditorCard";
import ReviewForm from "@/components/Review/ReviewForm";
import { IItem } from "@/types/review";

interface IReviewPageProps {
    items: IItem[];
}


const ReviewPage = ({ items }: IReviewPageProps) => {
    const { basePath } = useRouter();
    const [itemsState, setItemsState] = useState(items);

    return (
        <Container maxWidth="xl">
            {
                itemsState.map((item) => {
                    return (
                        <Box sx={{ mb: 2 }}>
                            <EditorCard>
                                <Grid item xs={12} md={4}>
                                    <ReviewForm product_id={item.product_id} product_variant_name={item.product_variant_name} />
                                </Grid>
                            </EditorCard>
                        </Box>
                    )
                }
                )
            }
        </Container>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { token } = context.query;
    const { res, req, locale } = context;

    console.log(token);

    const data = await orderItemsAPI(
        "GET",
        token as string,
        req as NextApiRequest,
        res as NextApiResponse,
    );

    console.log(data);
    let items = [];
    if (data) {
        for (let i = 0; i < data.items.length; i++) {
            items.push({
                product_variant_name: data.items[i].product_variant_name as string,
                product_id: data.items[i].product_id as number
            });
        }
    }

    console.log("ITEMS", items);

    // if (!data) {
    // } else if (data.slug && data.slug !== slug) {
    // }

    return {
        props: {
            items: items,
        },
    };
};

export default ReviewPage;
