// /components/dashboard/catalog/Products/Editor/ProductEditorWrapper.tsx
// react
// next.js
import { useRouter } from "next/router";
// libs
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

// layout
import DashboardLayout from "@/pages/dashboard/layout"; //react
import { ReactElement, useEffect, useReducer, useState } from "react";
import RootLayout from "@/pages/layout";
// components
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import TopLineWithReturn from "@/components/Dashboard/Catalog/Products/TopLineWithReturn";
import ProductVariantsEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantsEditor";
import ProductMediaEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductMediaEditor";
import ProductVariantPricesEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantPricesEditor";
import ProductVisibilitySelect from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVisibilitySelect";
import ProductCategorySelect from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductCategorySelect";
import ProductBasicInfo from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductBasicInfo";
import ProductTranslatedFieldsWrapper from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductTranslatedFields";
// mui
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// types
import {
  ActionSetProduct,
  IAttributeType,
  IProduct,
  ISetProductStateData,
} from "@/types/product";
import { postProduct, putProduct } from "@/api/country/product/product";
import { IPriceList } from "@/types/localization";

export interface ISetProductStateAction {
  type: ActionSetProduct;
  payload: ISetProductStateData;
}

interface IProductEditorWrapperProps {
  title: string;
  returnPath: string;
  // productId?: string;
  productData?: IProduct;
  attributesData: IAttributeType[];
  pricelistsData: IPriceList[];
}

const ProductEditorWrapper = ({
  title,
  returnPath,
  productData,
  attributesData,
  pricelistsData,
}: IProductEditorWrapperProps) => {
  /**
   * Product editor wrapper
   * @param title - title of the page
   * @param returnPath - path to return to
   * @param product - initial product data to edit (if any)
   *
   * This component holds the state of the product being edited as reducer state which is passed down to the child components as props.
   * Child components can dispatch actions to the reducer to update the "large" product state.
   */
  const setProductStateReducer = (
    state: ISetProductStateData,
    action: ISetProductStateAction
  ): ISetProductStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetProduct.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetProductStateData;
      case ActionSetProduct.SETID:
        return { ...state, id: action.payload.id };
      case ActionSetProduct.SETPUBLISHED:
        return { ...state, published: action.payload.published };
      case ActionSetProduct.SETCATEGORY:
        return { ...state, category: action.payload.category };
      case ActionSetProduct.SETTRANSLATION:
        if (!action.payload.translation) {
          return state;
        }

        console.log("SETTRANSLATION", action.payload, state);
        return {
          ...state,
          translations: {
            ...state.translations,
            [action.payload.translation.language]:
              state.translations &&
              action.payload.translation.language in state.translations
                ? {
                    ...state.translations[action.payload.translation.language],
                    ...action.payload.translation.data,
                  }
                : action.payload.translation.data,
          },
        };
      case ActionSetProduct.SETPRODUCTVARIANTS:
        console.log("SETPRODUCTVARIANTS", action.payload.product_variants);
        return { ...state, product_variants: action.payload.product_variants };
      case ActionSetProduct.SETMEDIA:
        return { ...state, product_media: action.payload.product_media };
      default:
        return state;
    }
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  console.log("productData", productData);

  const router = useRouter();

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const [productState, dispatchProductState] = useReducer(
    setProductStateReducer,
    productData
      ? productData
      : {
          id: null,
          published: false,
          category: null,
          product_variants: [],
          product_media: [],
          translations: {},
          update_at: undefined,
          create_at: undefined,
        }
  );

  console.log("productState", productState);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  const saveProductAndRedirect = async () => {
    console.log("saveAction", productState);
    postProduct(productState as IProduct)
      .then((res: any) => {
        console.log("postProduct", res);
        const { data } = res;
        const { id } = data;
        setPreventNavigation(false);
        router.replace(
          {
            pathname: `/dashboard/catalog/products/edit/[id]`,
            query: { id: id },
          },
          undefined,
          { shallow: true }
        );
      })
      .catch((err: any) => {
        console.log("postProduct", err);
        setSnackbar({
          open: true,
          message: "Something went wrong",
          severity: "error",
        });
      });
  };

  const updateProduct = async () => {
    console.log("updateAction", productState);

    putProduct(productState as IProduct)
      .then((res: any) => {
        console.log("putProduct", res);
        setPreventNavigation(false);
        setSnackbar({
          open: true,
          message: "Product updated",
          severity: "success",
        });
      })
      .catch((err: any) => {
        console.log("putProduct", err);
        setSnackbar({
          open: true,
          message: "Something went wrong",
          severity: "error",
        });
      });
  };

  console.log("productState", productState);

  return (
    <DashboardContentWithSaveFooter
      primaryButtonTitle={productData ? "Save" : "Create"} // To distinguish between create and update actions
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onSave={async () => {
        if (!productData) {
          // save product
          const resp = await saveProductAndRedirect();
        } else {
          // update product
          await updateProduct();
        }
      }}
    >
      <TopLineWithReturn
        title={"Add product"}
        returnPath={"/dashboard/catalog/products"}
      />

      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <ProductBasicInfo
            state={productState}
            dispatch={dispatchProductState}
          />
          <ProductTranslatedFieldsWrapper
            state={productState}
            dispatch={dispatchProductState}
          />
          <ProductVariantsEditor
            disabled={false}
            state={productState}
            dispatch={dispatchProductState}
            attributesData={attributesData}
            pricelistsData={pricelistsData}
          />
          <ProductMediaEditor
            disabled={false}
            // state={productState.product_media}
            // dispatch={dispatchProductState}
          />
          <ProductVariantPricesEditor
            disabled={false}
            state={productState}
            dispatch={dispatchProductState}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <ProductCategorySelect
            state={productState}
            dispatch={dispatchProductState}
          />
          <ProductVisibilitySelect
            state={productState}
            dispatch={dispatchProductState}
          />
        </Grid>
      </Grid>
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
    </DashboardContentWithSaveFooter>
  );
};

export default ProductEditorWrapper;
