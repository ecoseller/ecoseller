import { IOrderDetail } from "@/types/order";
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

interface IOrderDetailWrapperProps {
  order: IOrderDetail;
}

const OrderDetailWrapper = ({ order }: IOrderDetailWrapperProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useSnackbarState();

  const save = async () => {};

  return (
    <EditableContentWrapper
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        await save();
      }}
      returnPath={"/dashboard/orders"}
    >
      <TopLineWithReturn
        title={`Order #${order.token} detail`}
        returnPath="/dashboard/orders"
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <OrderDetailItemList cart={order.cart} />
        </Grid>
        <Grid item md={4} xs={12}>
          Nothing...
        </Grid>
      </Grid>
      {snackbar ? (
        <SnackbarWithAlert snackbarData={snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </EditableContentWrapper>
  );
};

export default OrderDetailWrapper;
