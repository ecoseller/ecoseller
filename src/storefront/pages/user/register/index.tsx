import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { IUser } from "@/types/user";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import UserGeneralInformation from "@/components/User/UserGeneralInformation";
import { useSnackbarState } from "@/utils/snackbar";
import { useUser } from "@/utils/context/user";
import UserPasswordInformation from "@/components/User/UserPasswordInformation";
import { userShippingInfoAPI } from "@/pages/api/user/shipping-info";
import { userBillingInfoAPI } from "@/pages/api/user/billing-info";
import { IBillingInfo, IShippingInfo } from "@/types/cart";
import BillingInfoForm, {
    IBillingInfoFormProps,
    billingInfoInitialData,
    exportBillingInfo,
} from "@/components/Forms/BillingInfoForm";
import ShippingInfoForm, {
    IShippingInfoFormProps,
    exportShippingInfo,
    shippingInfoInitialData,
} from "@/components/Forms/ShippingInfoForm";
import { error } from "console";
import { OrderList } from "@/components/Common/OrdersList";
import { userOrdersAPI } from "@/pages/api/user/orders";
import { IOrder } from "@/types/order";
import { orderItemsAPI } from "@/pages/api/order/items/[id]";
import EditorCard from "@/components/Generic/EditorCard";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const StorefrontUserRegisterPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

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

    const showSnackbar = (
        res: Response,
        messageSuccess: string,
        messageError: string
    ) => {
        if (!res?.ok) {
            setSnackbar({
                open: true,
                message: messageError,
                severity: "error",
            });
        } else {
            setSnackbar({
                open: true,
                message: messageSuccess,
                severity: "success",
            });
        }
    };


    const handleRegister = async () => {
        const response = await fetch("/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        const data = await response.json();
        if (!response?.ok) {
            showSnackbar(response, "Registration failed", response.statusText);
        } else {
            showSnackbar(response, "Registration successful", "Registration successful");
            router.push("/");
        }
    };

    return (
        <Container maxWidth="xl">
            <EditorCard>
                <Typography variant="h6">Registration form</Typography>
                <Box mt={2}>
                    <FormControl fullWidth>
                        <Stack spacing={2}>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                InputLabelProps={{
                                    shrink: Boolean(true),
                                }}
                            />
                            <FormControl fullWidth>
                                <Stack spacing={2}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            Password
                                        </InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                    {/* <TextField label="Name" /> */}
                                </Stack>
                            </FormControl>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleRegister}
                            >
                                Register
                            </Button>
                        </Stack>
                    </FormControl>
                </Box>
                {snackbar ? (
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
                ) : null}
            </EditorCard>
        </Container>
    );
};

export default StorefrontUserRegisterPage;
