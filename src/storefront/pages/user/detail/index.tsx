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

    const [validBillingInfo, setValidBillingInfo] = useState<boolean>(false);
    const [billingInfoState, setBillingInfoState] =
        useState<IBillingInfoFormProps>({} as IBillingInfoFormProps);

    if (Object.keys(billingInfoState)?.length === 0) {
        // TODO: setting the country to cz is a temporary solution
        setBillingInfoState(
            billingInfoInitialData(
                { ...billingInfo, country: "cz" } as IBillingInfo,
                setBillingInfoState
            ));
        console.log(billingInfoState)
    }

    const [validShippingInfo, setValidShippingInfo] = useState<boolean>(false);
    const [shippingInfoState, setShippingInfoState] =
        useState<IShippingInfoFormProps>({} as IShippingInfoFormProps);

    if (Object.keys(shippingInfoState)?.length === 0) {
        setShippingInfoState(
            // TODO: setting the country to cz is a temporary solution
            shippingInfoInitialData(
                { ...shippingInfo, country: "cz" },
                setShippingInfoState
            )
        );
    }

    const hanldleGeneralInfoSave = async () => {
        // save user details
        const res = await fetch(`/api/user/detail`, {
            method: "PUT",
            body: JSON.stringify(state),
        });
        if (!res?.ok) {
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }
        else {
            setSnackbar({
                open: true,
                message: "User general information updated",
                severity: "success",
            });
        }
    };

    const hanleBillingInfoSave = async () => {
        const billingInfo = exportBillingInfo(billingInfoState);
        const res = await fetch(`/api/user/billing-info`, {
            method: "PUT",
            body: JSON.stringify(billingInfo),
        });
        if (!res?.ok) {
            console.log(res)
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }
        else {
            setSnackbar({
                open: true,
                message: "User billing information updated",
                severity: "success",
            });
        }
    };

    const hanleShippingInfoSave = async () => {
        const shippingInfo = exportShippingInfo(shippingInfoState);
        const res = await fetch(`/api/user/shipping-info`, {
            method: "PUT",
            body: JSON.stringify(shippingInfo),
        });
        if (!res?.ok) {
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }
        else {
            setSnackbar({
                open: true,
                message: "User shipping information updated",
                severity: "success",
            });
        }
    };



    const handleSave = async () => {
        // save user details

        let error: boolean = false;
        let res = await fetch(`/api/user/detail`, {
            method: "PUT",
            body: JSON.stringify(state),
        });
        if (!res?.ok) {
            error = true;
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }

        const shippingInfo = exportShippingInfo(shippingInfoState);
        res = await fetch(`/api/user/shipping-info`, {
            method: "PUT",
            body: JSON.stringify(shippingInfo),
        });
        if (!res?.ok) {
            error = true;
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }

        const billingInfo = exportBillingInfo(billingInfoState);
        res = await fetch(`/api/user/billing-info`, {
            method: "PUT",
            body: JSON.stringify(billingInfo),
        });
        if (!res?.ok) {
            error = true;
            setSnackbar({
                open: true,
                message: res?.statusText,
                severity: "error",
            });
        }
        if (!error) {
            setSnackbar({
                open: true,
                message: "User updated",
                severity: "success",
            });
        }
    };

    return (
        <Container maxWidth="xl">
            <UserGeneralInformation
                state={state}
                setState={(v: IUser) => setState(v)}
            />
            <Box m={3} marginRight={10}>
                <Stack
                    direction="row"
                    justifyContent="end"
                    spacing={5}
                    sx={{
                        msTransform: "translateY(-40%)",
                        transform: "translateY(-30%)",
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                    >
                        Clear general information
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={hanldleGeneralInfoSave}
                    >
                        Save general information
                    </Button>
                </Stack>
            </Box>
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
                <Box m={3} marginLeft={0}>
                    <Stack
                        direction="row"
                        justifyContent="end"
                        spacing={5}
                        sx={{
                            msTransform: "translateY(-40%)",
                            transform: "translateY(-30%)",
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                        >
                            Clear billing info
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={hanleBillingInfoSave}
                        >
                            Save billing info
                        </Button>
                    </Stack>
                </Box>
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
                <Box m={3} marginLeft={0}>
                    <Stack
                        direction="row"
                        justifyContent="end"
                        spacing={5}
                        sx={{
                            msTransform: "translateY(-40%)",
                            transform: "translateY(-30%)",
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="primary"
                        >
                            Clear shipping info
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={hanleShippingInfoSave}
                        >
                            Save shipping info
                        </Button>
                    </Stack>
                </Box>
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
                        Save All
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

    const shippingInfo = await userShippingInfoAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    const billingInfo = await userBillingInfoAPI(
        "GET",
        req as NextApiRequest,
        res as NextApiResponse
    );

    return {
        props: {
            billingInfo,
            shippingInfo,
        },
    };
};

export default StorefrontUserEditPage;
