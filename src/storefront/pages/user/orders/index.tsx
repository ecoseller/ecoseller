import { useRouter } from "next/router";
import RootLayout from "@/pages/layout";
import { ReactElement, useEffect, useState } from "react";
import { Alert, Box, Button, Container, Snackbar, Stack, Typography } from "@mui/material";
import { IUser } from "@/types/user";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import UserGeneralInformation from "@/components/User/UserGeneralInformation";
import { useSnackbarState } from "@/utils/snackbar";
import { useUser } from "@/utils/context/user";
import UserPasswordInformation from "@/components/User/UserPasswordInformation";
import { userShippingInfoAPI } from "@/pages/api/user/shipping-info";
import { userBillingInfoAPI } from "@/pages/api/user/billing-info";
import { IBillingInfo, IShippingInfo } from "@/types/cart";
import BillingInfoForm, { IBillingInfoFormProps, billingInfoInitialData, exportBillingInfo } from "@/components/Forms/BillingInfoForm";
import ShippingInfoForm, { IShippingInfoFormProps, exportShippingInfo, shippingInfoInitialData } from "@/components/Forms/ShippingInfoForm";
import { error } from "console";
import { OrderList } from "@/components/Common/OrdersList";
import { userOrdersAPI } from "@/pages/api/user/orders";
import { IOrder } from "@/types/order";
import { orderItemsAPI } from "@/pages/api/order/items/[id]";

interface IUserOrdersProps {
    orders: IOrder[];
}

const StorefrontUserEditPage = ({ orders }: IUserOrdersProps) => {
    const router = useRouter();

    const [state, setState] = useState<IUserOrdersProps>({ orders });
    console.log("Orders", state);

    const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

    const [snackbar, setSnackbar] = useSnackbarState();

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar(null);
    };


    const showSnackbar = (res: Response, messageSuccess: string, messageError: string) => {
        if (!res?.ok) {
            setSnackbar({
                open: true,
                message: messageError,
                severity: "error",
            });
        }
        else {
            setSnackbar({
                open: true,
                message: messageSuccess,
                severity: "success",
            });
        }
    };

    return (
        <Container maxWidth="xl">
            <OrderList orders={orders} />
        </Container >
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { req, res } = context;

    const orders = await userOrdersAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    if (orders?.length != 0) {
        for (const order of orders) {
            order.items = [];
            const items = await orderItemsAPI(
                "GET",
                order.token,
                req as NextApiRequest,
                res as NextApiResponse
            );
            console.log("Items", items);
            if (items?.length != 0) {
                for (const item of items.items) {
                    console.log("Item", item)
                    console.log("item variant name", item.product_variant_name)
                    order.items.push(item.product_variant_name);
                }
            }
        }
    }


    return {
        props: {
            orders: orders,
        },
    };
};

export default StorefrontUserEditPage;
