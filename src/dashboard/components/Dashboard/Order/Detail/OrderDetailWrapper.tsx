import { IOrderDetail, OrderStatus } from "@/types/order";
import EditableContentWrapper from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import React, { useState } from "react";
import OrderDetailItemList from "@/components/Dashboard/Order/Detail/OrderDetailItemList";
import Grid from "@mui/material/Grid";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";
import { useSnackbarState } from "@/utils/snackbar";
import OrderDetailStatus from "@/components/Dashboard/Order/Detail/OrderDetailStatus";
import { getOrder, updateOrderStatus } from "@/api/order/order";
import { PermissionProvider } from "@/utils/context/permission";
import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";
import OrderDetailBillingInfo from "@/components/Dashboard/Order/Detail/OrderDetailBillingInfo";
import { ICountryBase } from "@/types/country";
import OrderDetailShippingInfo from "@/components/Dashboard/Order/Detail/OrderDetailShippingInfo";
import { updateBillingInfo, updateShippingInfo } from "@/api/cart/cart";
import {
  ITranslatedPaymentMethodCountryBase,
  ITranslatedShippingMethodCountryBase,
} from "@/types/cart/methods";
import OrderDetailMethod from "@/components/Dashboard/Order/Detail/OrderDetailMethod";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";

interface IOrderDetailWrapperProps {
  order: IOrderDetail;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
  countryOptions: ICountryBase[];
  paymentMethodCountry: ITranslatedPaymentMethodCountryBase | null;
  shippingMethodCountry: ITranslatedShippingMethodCountryBase | null;
}

const OrderDetailWrapper = ({
  order,
  billingInfo,
  shippingInfo,
  countryOptions,
  paymentMethodCountry,
  shippingMethodCountry,
}: IOrderDetailWrapperProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useSnackbarState();
  const [orderState, setOrderState] = useState<IOrderDetail>(order);
  const [billingInfoState, setBillingInfoState] = useState(billingInfo);
  const [shippingInfoState, setShippingInfoState] = useState(shippingInfo);

  const save = async () => {
    const updateOrderRequest = updateOrderStatus(
      order.token,
      orderState.status
    );
    const updateBillingInfoRequest = updateBillingInfo(
      order.cart.token,
      billingInfoState
    );
    const updateShippingInfoRequest = updateShippingInfo(
      order.cart.token,
      shippingInfoState
    );

    await Promise.all([
      updateOrderRequest,
      updateBillingInfoRequest,
      updateShippingInfoRequest,
    ]);

    setSnackbar({
      open: true,
      message: "Order updated",
      severity: "success",
    });
  };

  const setOrderStatus = (orderStatus: OrderStatus) => {
    setPreventNavigation(true);
    setOrderState({ ...orderState, status: orderStatus });
  };

  const recalculateOrderPrice = async () => {
    const order = await getOrder(orderState.token);
    setOrderState({
      ...orderState,
      cart: {
        ...orderState.cart,
        total_items_price_without_vat_formatted:
          order.cart.total_items_price_without_vat_formatted,
      },
    });
  };

  const editableForms = [OrderStatus.Pending, OrderStatus.Processing].includes(
    orderState.status
  );

  return (
    <EditableContentWrapper
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={save}
      returnPath={"/dashboard/orders"}
    >
      <TopLineWithReturn
        title={`Order #${orderState.token} detail`}
        returnPath="/dashboard/orders"
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <PermissionProvider allowedPermissions={["cart_change_permission"]}>
            <OrderDetailItemList
              cart={orderState.cart}
              recalculateOrderPrice={recalculateOrderPrice}
              isEditable={editableForms}
            />
          </PermissionProvider>
          <PermissionProvider allowedPermissions={["order_change_permission"]}>
            <OrderDetailShippingInfo
              shippingInfo={shippingInfoState}
              setShippingInfo={setShippingInfoState}
              countryOptions={countryOptions}
              isEditable={editableForms}
              preventNavigation={() => setPreventNavigation(true)}
            />
            <OrderDetailBillingInfo
              billingInfo={billingInfoState}
              setBillingInfo={setBillingInfoState}
              countryOptions={countryOptions}
              isEditable={editableForms}
              preventNavigation={() => setPreventNavigation(true)}
            />
            <EditorCard>
              <CollapsableContentWithTitle title="Shipping & payment method">
                {shippingMethodCountry ? (
                  <OrderDetailMethod
                    method={shippingMethodCountry.shipping_method}
                    formattedPrice={shippingMethodCountry.price_without_vat}
                  />
                ) : null}
                {paymentMethodCountry ? (
                  <OrderDetailMethod
                    method={paymentMethodCountry.payment_method}
                    formattedPrice={paymentMethodCountry.price_without_vat}
                  />
                ) : null}
              </CollapsableContentWithTitle>
            </EditorCard>
          </PermissionProvider>
        </Grid>
        <Grid item md={4} xs={12}>
          <PermissionProvider allowedPermissions={["order_change_permission"]}>
            <OrderDetailStatus
              orderStatus={orderState.status}
              setOrderStatus={setOrderStatus}
            />
          </PermissionProvider>
        </Grid>
      </Grid>
      {snackbar ? (
        <SnackbarWithAlert snackbarData={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </EditableContentWrapper>
  );
};

export default OrderDetailWrapper;
