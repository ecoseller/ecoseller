// /components/dashboard/catalog/Products/Editor/ProductEditorWrapper.tsx
// react
// next.js
import { useRouter } from "next/router";
// libs
// layout
import { useEffect, useReducer, useState } from "react";
// components
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import ProductVariantsEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantsEditor";
import ProductMediaEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductMediaEditor";
import ProductVariantPricesEditor from "@/components/Dashboard/Catalog/Products/Editor/Product/ProductVariantPricesEditor";
import EntityVisibilityForm from "@/components/Dashboard/Generic/Forms/EntityVisibilityForm";
import CategorySelectForm from "@/components/Dashboard/Generic/Forms/CategorySelectForm";
import TranslatedFieldsTabList from "@/components/Dashboard/Generic/TranslatedFieldsTabList";
// mui
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// types
import {
  ActionSetProduct,
  IAttributeType,
  IProduct,
  IProductTranslations,
  IProductType,
  ISetProductStateData,
} from "@/types/product";
import { postProduct, putProduct } from "@/api/country/product/product";
import { IPriceList } from "@/types/localization";
import ProductTypeSelect from "./Product/ProductTypeSelect";
import TranslatedSEOFieldsTabList from "../../../Generic/TranslatedSEOFieldsTabList";
import { IDispatchWrapper } from "@/components/Dashboard/Common/IDispatchWrapper";
import { IEntityTranslations } from "@/types/common";
import { OutputData } from "@editorjs/editorjs";
import { generalSnackbarError, useSnackbarState } from "@/utils/snackbar";
import SnackbarWithAlert from "@/components/Dashboard/Generic/SnackbarWithAlert";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DeleteEntityButton from "@/components/Dashboard/Generic/DeleteEntityButton";
import { PermissionProvider } from "@/utils/context/permission";
import DeleteDialog from "@/components/Dashboard/Generic/DeleteDialog";

export interface ISetProductStateAction {
  type: ActionSetProduct;
  payload: ISetProductStateData;
}

interface IProductEditorWrapperProps {
  title: string;
  returnPath: string;
  // productId?: string;
  productData?: IProduct;
  attributesData?: IAttributeType[];
  pricelistsData: IPriceList[];
  productTypeData?: IProductType[];
}

/**
 * Product editor wrapper
 * @param title - title of the page
 * @param returnPath - path to return to
 * @param product - initial product data to edit (if any)
 *
 * This component holds the state of the product being edited as reducer state which is passed down to the child components as props.
 * Child components can dispatch actions to the reducer to update the "large" product state.
 */
const ProductEditorWrapper = ({
  title,
  returnPath,
  productData,
  attributesData,
  pricelistsData,
  productTypeData,
}: IProductEditorWrapperProps) => {
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
        return { ...state, media: action.payload.media };
      case ActionSetProduct.SETPRODUCTTYPEID:
        return { ...state, type_id: action.payload.type_id };
      case ActionSetProduct.SETPRODUCTTYPE:
        return { ...state, type: action.payload.type };
      default:
        return state;
    }
  };

  const [snackbar, setSnackbar] = useSnackbarState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const router = useRouter();

  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  console.log("productData", productData);
  const [productState, dispatchProductState] = useReducer(
    setProductStateReducer,
    productData
      ? productData
      : {
          id: null,
          published: false,
          category: null,
          product_variants: [],
          translations: {},
          update_at: undefined,
          create_at: undefined,
          media: [],
        }
  );

  const dispatchWrapper: IDispatchWrapper = {
    setDescription(language: string, description: OutputData): void {
      dispatchProductState({
        type: ActionSetProduct.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              description_editorjs: description,
            },
          },
        },
      });
    },
    setSlug(language: string, slug: string): void {
      dispatchProductState({
        type: ActionSetProduct.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              slug: slug,
            },
          },
        },
      });
    },
    setTitle(language: string, title: string): void {
      dispatchProductState({
        type: ActionSetProduct.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              title: title,
            },
          },
        },
      });
    },
    setMetaDescription(language: string, metaDescription: string) {
      dispatchProductState({
        type: ActionSetProduct.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              meta_description: metaDescription,
            },
          },
        },
      });
    },
    setMetaTitle(language: string, metaTitle: string) {
      dispatchProductState({
        type: ActionSetProduct.SETTRANSLATION,
        payload: {
          translation: {
            language,
            data: {
              meta_title: metaTitle,
            },
          },
        },
      });
    },
  };

  useEffect(() => {
    if (productData) {
      return;
    }
    // filter out the product type with id = productState.type_id
    const productType = productTypeData?.find(
      (productType) => productType.id === productState.type_id
    );
    console.log("productType", productType);
    dispatchProductState({
      type: ActionSetProduct.SETPRODUCTTYPE,
      payload: { type: productType },
    });
  }, [productState.type_id]);

  console.log("productState", productState);

  const saveProductAndRedirect = async () => {
    postProduct(productState as IProduct)
      .then((data: any) => {
        console.log("postProduct", data);
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
        setSnackbar(generalSnackbarError);
      });
  };

  const updateProduct = async () => {
    console.log("updateAction", productState);

    putProduct(productState as IProduct)
      .then((data: any) => {
        console.log("putProduct", data);
        setPreventNavigation(false);
        setSnackbar({
          open: true,
          message: "Product updated",
          severity: "success",
        });
      })
      .catch((err: any) => {
        console.log("putProduct", err);
        setSnackbar(generalSnackbarError);
      });
  };

  const setPublished = (published: boolean) => {
    dispatchProductState({
      type: ActionSetProduct.SETPUBLISHED,
      payload: { published: published },
    });
  };

  const setCategoryId = (categoryId: number | null) => {
    dispatchProductState({
      type: ActionSetProduct.SETCATEGORY,
      payload: { category: categoryId },
    });
  };

  const deleteProduct = async () => {
    if (!productData) {
      return;
    }
    await setPreventNavigation(false);
    fetch(`/api/product/${productData.id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log("deleteProduct", res);
        router.replace(
          {
            pathname: `/dashboard/catalog/products`,
          },
          undefined,
          {}
        );
      })
      .catch(() => {
        setSnackbar(generalSnackbarError);
      });
  };

  return (
    <EditableContentWrapper
      primaryButtonTitle={
        productData ? PrimaryButtonAction.Save : PrimaryButtonAction.Create
      } // To distinguish between create and update actions
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        if (!productData) {
          // save product
          const resp = await saveProductAndRedirect();
        } else {
          // update product
          await updateProduct();
        }
      }}
      returnPath={"/dashboard/catalog/products"}
    >
      <TopLineWithReturn
        title={title}
        returnPath={"/dashboard/catalog/products"}
      />

      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <PermissionProvider
            allowedPermissions={["product_change_permission"]}
          >
            <TranslatedFieldsTabList
              state={productState.translations || ({} as IEntityTranslations)}
              dispatchWrapper={dispatchWrapper}
            />
            <TranslatedSEOFieldsTabList
              state={productState.translations || ({} as IEntityTranslations)}
              dispatchWrapper={dispatchWrapper}
            />
            <ProductVariantsEditor
              disabled={false}
              state={productState}
              dispatch={dispatchProductState}
              attributesData={productState?.type?.allowed_attribute_types || []}
              pricelistsData={pricelistsData}
            />
          </PermissionProvider>
          <PermissionProvider
            allowedPermissions={["productmedia_change_permission"]}
          >
            <ProductMediaEditor disabled={false} state={productState} />
          </PermissionProvider>
          <PermissionProvider
            allowedPermissions={["productprice_change_permission"]}
          >
            <ProductVariantPricesEditor
              disabled={false}
              state={productState}
              dispatch={dispatchProductState}
              pricelistsData={pricelistsData}
            />
          </PermissionProvider>
        </Grid>
        <Grid item md={4} xs={12}>
          <PermissionProvider
            allowedPermissions={["product_change_permission"]}
          >
            <CategorySelectForm
              categoryId={productState.category}
              setCategoryId={setCategoryId}
            />
            <ProductTypeSelect
              types={productTypeData}
              state={productState}
              dispatch={dispatchProductState}
              disabled={productData ? true : false}
            />
            <EntityVisibilityForm
              isPublished={productState.published || false}
              setValue={setPublished}
            />
          </PermissionProvider>
        </Grid>
      </Grid>
      {snackbar ? (
        <SnackbarWithAlert snackbarData={snackbar} setSnackbar={setSnackbar} />
      ) : null}
      {productData ? (
        <DeleteEntityButton onDelete={() => setOpenDeleteDialog(true)} />
      ) : null}
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        onDelete={async () => {
          await deleteProduct();
        }}
        text="this product"
      />
    </EditableContentWrapper>
  );
};

export default ProductEditorWrapper;
