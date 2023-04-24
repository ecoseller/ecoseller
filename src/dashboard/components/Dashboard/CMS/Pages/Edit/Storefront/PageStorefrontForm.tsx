// next

// react
import { useReducer, useState } from "react";

// libs
import { putFrontendPage } from "@/api/cms/page/page";

// components
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import PageStorefrontBasicInfo from "./PageStorefrontBasicInfo";

// mui
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";

// types
import {
  ActionSetPageStorefront,
  IPageFrontend,
  ISetPageStorefrontStateData,
} from "@/types/cms";
import PageStorefrontTranslatedFieldsWrapper from "./PageStorefrontTranslatedFields";

interface IPageFrontendFormProps {
  storefrontPageData: IPageFrontend;
}

export interface ISetPageStorefrontStateAction {
  type: ActionSetPageStorefront;
  payload: ISetPageStorefrontStateData;
}

const PageStorefrontForm = ({ storefrontPageData }: IPageFrontendFormProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const setPageStorefrontStateReducer = (
    state: ISetPageStorefrontStateData,
    action: any
  ): ISetPageStorefrontStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetPageStorefront.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetPageStorefrontStateData;
      case ActionSetPageStorefront.SETPUBLISHED:
        return { ...state, published: action.payload.published };
      case ActionSetPageStorefront.SETTRANSLATION:
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
      case ActionSetPageStorefront.SETFRONTENDPATH:
        return { ...state, frontend_path: action.payload.frontend_path };
      case ActionSetPageStorefront.SETCATEGORIES:
        return { ...state, categories: action.payload.categories };
      default:
        return state;
    }
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [pageStorefrontState, dispatchPageStorefrontState] = useReducer(
    setPageStorefrontStateReducer,
    storefrontPageData
  );

  return (
    <EditableContentWrapper
      primaryButtonTitle={PrimaryButtonAction.Save}
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        console.log(pageStorefrontState);

        if (!pageStorefrontState.id) {
          setSnackbar({
            open: true,
            message: "Page could not be created, it does not have an ID",
            severity: "error",
          });
          return;
        }

        await putFrontendPage(pageStorefrontState.id, pageStorefrontState)
          .then((resp) => {
            setSnackbar({
              open: true,
              message: "Page updated successfully",
              severity: "success",
            });
          })
          .catch((err) => {
            setSnackbar({
              open: true,
              message: "Page could not be created",
              severity: "error",
            });
          });
      }}
      returnPath={"/dashboard/cms/pages"}
    >
      <TopLineWithReturn
        title={`Edit storefront page #${storefrontPageData.id}`}
        returnPath={"/dashboard/cms/pages"}
      />

      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <PageStorefrontTranslatedFieldsWrapper
            state={pageStorefrontState}
            dispatch={dispatchPageStorefrontState}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <PageStorefrontBasicInfo
            state={pageStorefrontState}
            dispatch={dispatchPageStorefrontState}
          />
        </Grid>
      </Grid>
      {snackbar ? (
        <Snackbar open={snackbar.open} autoHideDuration={6000}>
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      ) : null}
    </EditableContentWrapper>
  );
};

export default PageStorefrontForm;
