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
import BillingInfoForm, { IBillingInfoFormProps, billingInfoInitialData } from "@/components/Forms/BillingInfoForm";
import ShippingInfoForm, { IShippingInfoFormProps, shippingInfoInitialData } from "@/components/Forms/ShippingInfoForm";

interface IUserProps {
    billingInfo: IBillingInfo;
    shippingInfo: IShippingInfo;
}

const StorefrontUserEditPage = ({ billingInfo, shippingInfo }: IUserProps) => {
    const router = useRouter();
    const { id } = router.query;

    const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
    const { user } = useUser();
    const [state, setState] = useState<IUser>(user);
    useEffect(() => {
        setState(user);
    }, [user]);

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

    useEffect(() => {
        if (!preventNavigation) {
            setPreventNavigation(true);
        }
    }, [state]);


    const handleSave = async () => {
        if (state) {
            const res = await fetch(`/api/user/${id}`, {
                method: "PUT",
                body: JSON.stringify(state),
            });
            const data = await res.json();
            if (data?.error) {
                setSnackbar({
                    open: true,
                    message: data?.error,
                    severity: "error",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "User updated",
                    severity: "success",
                });
            }
        }
    };

    const [validBillingInfo, setValidBillingInfo] = useState<boolean>(false);
    const [billingInfoState, setBillingInfoState] =
        useState<IBillingInfoFormProps>({} as IBillingInfoFormProps);

    if (Object.keys(billingInfoState)?.length === 0) {
        setBillingInfoState(
            billingInfoInitialData(
                { ...billingInfo, } as IBillingInfo,
                setBillingInfoState
            ));
    }

    const [validShippingInfo, setValidShippingInfo] = useState<boolean>(false);
    const [shippingInfoState, setShippingInfoState] =
        useState<IShippingInfoFormProps>({} as IShippingInfoFormProps);

    if (Object.keys(shippingInfoState)?.length === 0) {
        setShippingInfoState(
            shippingInfoInitialData(
                { ...shippingInfo },
                setShippingInfoState
            )
        );
    }

    return (
        <Container maxWidth="xl">
            <UserGeneralInformation
                state={state}
                setState={(v: IUser) => setState(v)}
            />
            <UserPasswordInformation
                selfEdit={user?.email === state?.email}
                email={state?.email}
                snackbar={snackbar}
                setSnackbar={(v: any) => setSnackbar(v)}
            />
            <Box pl={3} mt={2}>
                <Typography variant="h6">Billing info</Typography>
                <BillingInfoForm
                    first_name={billingInfoState?.first_name}
                    surname={billingInfoState?.surname}
                    company_name={billingInfoState?.company_name}
                    company_id={billingInfoState?.company_id}
                    vat_number={billingInfoState?.vat_number}
                    street={billingInfoState?.street}
                    city={billingInfoState?.city}
                    postal_code={billingInfoState?.postal_code}
                    country={billingInfoState?.country}
                    setIsFormValid={setValidBillingInfo}
                />
                <Typography variant="h6">Shipping info</Typography>
                <ShippingInfoForm
                    first_name={shippingInfoState?.first_name}
                    surname={shippingInfoState?.surname}
                    email={shippingInfoState?.email}
                    phone={shippingInfoState?.phone}
                    additional_info={shippingInfoState?.additional_info}
                    street={shippingInfoState?.street}
                    city={shippingInfoState?.city}
                    postal_code={shippingInfoState?.postal_code}
                    country={shippingInfoState?.country}
                    setIsFormValid={setValidShippingInfo}
                />
            </Box>
            <Box m={3} marginRight={10}>
                <Stack
                    direction="row"
                    justifyContent="end"
                    mb={5}
                    spacing={5}
                    sx={{
                        msTransform: "translateY(-40%)",
                        transform: "translateY(-30%)",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => {
                            router.replace("/");
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Stack>
            </Box>
            {
                snackbar ? (
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={snackbar.severity}
                            sx={{ width: "100%" }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                ) : null
            }
        </Container >
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { req, res } = context;

    const shippingInfoBE = await userShippingInfoAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    const shippingInfo = {
        id: shippingInfoBE?.id || "",
        first_name: shippingInfoBE?.first_name || "",
        surname: shippingInfoBE?.surname || "",
        street: shippingInfoBE?.street || "",
        city: shippingInfoBE?.city || "",
        postal_code: shippingInfoBE?.postal_code || "",
        country: shippingInfoBE?.country || "",
        email: shippingInfoBE?.email || "",
        phone: shippingInfoBE?.phone || "",
        additional_info: shippingInfoBE?.additional_info || "",
    }

    const billingInfoBE = await userBillingInfoAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    const billingInfo = {
        id: billingInfoBE?.id || "",
        first_name: billingInfoBE?.first_name || "",
        surname: billingInfoBE?.surname || "",
        company_name: billingInfoBE?.company_name || "",
        company_id: billingInfoBE?.company_id || "",
        vat_number: billingInfoBE?.vat_number || "",
        street: billingInfoBE?.street || "",
        city: billingInfoBE?.city || "",
        postal_code: billingInfoBE?.postal_code || "",
        country: billingInfoBE?.country || "",
    }

    return {
        props: {
            billingInfo,
            shippingInfo,
        },
    };
};

export default StorefrontUserEditPage;
