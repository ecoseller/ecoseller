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

// mui
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";

// types
import {
  ActionSetPageCategory,
  IPageCategory,
  ISetPageCategoryStateData,
} from "@/types/cms";
import { putPageCategory } from "@/api/cms/category/category";
import PageCategoryTranslatedFieldsWrapper from "./PageCategoryTranslatedFieldsWrapper";
import PageCategoryBasicInfo from "./PageCategoryBasicInfo";
import { useSnackbarState } from "@/utils/snackbar";

interface IPageCategoryFormProps {
  pageCategoryData: IPageCategory;
}

export interface ISetPageCategoryStateAction {
  type: ActionSetPageCategory;
  payload: ISetPageCategoryStateData;
}

const PageCategoryForm = ({ pageCategoryData }: IPageCategoryFormProps) => {
  console.log("pageCategoryData", pageCategoryData);
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const setPageCategoryStateReducer = (
    state: ISetPageCategoryStateData,
    action: any
  ): ISetPageCategoryStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetPageCategory.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetPageCategoryStateData;
      case ActionSetPageCategory.SETCODE:
        return { ...state, code: action.payload.code };
      case ActionSetPageCategory.SETPUBLISHED:
        return { ...state, published: action.payload.published };
      case ActionSetPageCategory.SETTYPE:
        return { ...state, type: action.payload.type };
      case ActionSetPageCategory.SETTRANSLATION:
        if (!action.payload.translation) {
          return state;
        }
        console.log("action.payload.translation", action.payload.translation);
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
      default:
        return state;
    }
  };

  const [snackbar, setSnackbar] = useSnackbarState();

  const [pageCateogryState, dispatchPageCategoryState] = useReducer(
    setPageCategoryStateReducer,
    pageCategoryData
  );

  console.log("pageCateogryState", pageCateogryState);

  return (
    <EditableContentWrapper
      primaryButtonTitle={PrimaryButtonAction.Save}
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        console.log(pageCategoryData);

        if (!pageCategoryData.id) {
          setSnackbar({
            open: true,
            message:
              "Page category could not be created, it does not have an ID",
            severity: "error",
          });
          return;
        }

        await putPageCategory(
          pageCategoryData.id,
          pageCateogryState as IPageCategory
        )
          .then((resp) => {
            setSnackbar({
              open: true,
              message: "Category updated successfully",
              severity: "success",
            });
          })
          .catch((err) => {
            setSnackbar({
              open: true,
              message: "Category could not be created",
              severity: "error",
            });
          });
      }}
      returnPath={"/dashboard/cms/categories"}
    >
      <TopLineWithReturn
        title={`Edit page category #${pageCategoryData?.id}`}
        returnPath={"/dashboard/cms/categories"}
      />

      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <PageCategoryTranslatedFieldsWrapper
            state={pageCateogryState}
            dispatch={dispatchPageCategoryState}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <PageCategoryBasicInfo
            state={pageCateogryState}
            dispatch={dispatchPageCategoryState}
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

export default PageCategoryForm;
