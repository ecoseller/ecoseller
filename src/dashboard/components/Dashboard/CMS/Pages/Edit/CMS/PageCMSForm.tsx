import { putCMSPage } from "@/api/cms/page/page";
import EditableContentWrapper, {
  PrimaryButtonAction,
} from "@/components/Dashboard/Generic/EditableContentWrapper";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import { ActionSetPageCMS, IPageCMS, ISetPageCMSStateData } from "@/types/cms";
import { Alert } from "@mui/material";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { useReducer, useState } from "react";
import PageCMSTranslatedFieldsWrapper from "./PageCMSTranslatedFields";
import PageCMSBasicInfo from "./PageCMSBasicInfo";

interface IPageCMSFormProps {
  CMSPageData: IPageCMS;
}

export interface ISetPageCMSStateAction {
  type: ActionSetPageCMS;
  payload: ISetPageCMSStateData;
}

const PageCMSForm = ({ CMSPageData }: IPageCMSFormProps) => {
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);

  const setPageStorefrontStateReducer = (
    state: ISetPageCMSStateData,
    action: any
  ): ISetPageCMSStateData => {
    setPreventNavigation(true);
    switch (action.type) {
      case ActionSetPageCMS.SETINITIAL:
        if (!action.payload) {
          return state;
        }
        if (!action.payload.id) {
          return state;
        }
        return action.payload as ISetPageCMSStateData;
      case ActionSetPageCMS.SETPUBLISHED:
        return { ...state, published: action.payload.published };
      case ActionSetPageCMS.SETTRANSLATION:
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
      default:
        return state;
    }
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);

  const [pageCMSState, dispatchPageCMSState] = useReducer(
    setPageStorefrontStateReducer,
    CMSPageData
  );

  return (
    <EditableContentWrapper
      primaryButtonTitle={PrimaryButtonAction.Save}
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        console.log(pageCMSState);

        if (!pageCMSState.id) {
          setSnackbar({
            open: true,
            message: "Page could not be created, it does not have an ID",
            severity: "error",
          });
          return;
        }
        await putCMSPage(pageCMSState.id, pageCMSState)
          .then((resp) => {
            setSnackbar({
              open: true,
              message: "Page updated successfully",
              severity: "success",
            });
          })
          .catch((err) => {
            console.log(err);
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
        title={`Edit page #${CMSPageData.id}`}
        returnPath={"/dashboard/cms/pages"}
      />

      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <PageCMSTranslatedFieldsWrapper
            state={pageCMSState}
            dispatch={dispatchPageCMSState}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <PageCMSBasicInfo
            state={pageCMSState}
            dispatch={dispatchPageCMSState}
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

export default PageCMSForm;
