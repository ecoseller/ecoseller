import { IOrderDetail, OrderStatus } from "@/types/order";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import React, { useState } from "react";
import OrderDetailItemList from "@/components/Dashboard/Order/Detail/OrderDetailItemList";
import Grid from "@mui/material/Grid";
import TranslatedFieldsTabList from "@/components/Dashboard/Generic/TranslatedFieldsTabList";
import TranslatedSEOFieldsTabList from "@/components/Dashboard/Generic/TranslatedSEOFieldsTabList";
import CategorySelectForm from "@/components/Dashboard/Generic/Forms/CategorySelectForm";
import EntityVisibilityForm from "@/components/Dashboard/Generic/Forms/EntityVisibilityForm";
import DeleteEntityButton from "@/components/Dashboard/Generic/DeleteEntityButton";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";
import { useSnackbarState } from "@/utils/snackbar";
import OrderDetailStatus from "@/components/Dashboard/Order/Detail/OrderDetailStatus";
import { getOrder, updateOrderStatus } from "@/api/order/order";
import OrderDetailBillingShippingInfo from "@/components/Dashboard/Order/Detail/OrderDetailBillingShippingInfo";
import { PermissionProvider } from "@/utils/context/permission";
import { IBillingInfo, IShippingInfo } from "@/types/cart/cart";

interface IOrderDetailWrapperProps {
  order: IOrderDetail;
  billingInfo: IBillingInfo;
  shippingInfo: IShippingInfo;
}

const OrderDetailWrapper = ({
  order,
  billingInfo,
  shippingInfo,
}: IOrderDetailWrapperProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useSnackbarState();
  const [orderState, setOrderState] = useState<IOrderDetail>(order);

  const save = async () => {
    await updateOrderStatus(order.token, orderState.status);
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
        total_price_net_formatted: order.cart.total_price_net_formatted,
      },
    });
  };

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
              orderStatus={orderState.status}
            />
          </PermissionProvider>
          <PermissionProvider allowedPermissions={["order_change_permission"]}>
            <OrderDetailBillingShippingInfo
              billingInfo={billingInfo}
              shippingInfo={shippingInfo}
            />
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
