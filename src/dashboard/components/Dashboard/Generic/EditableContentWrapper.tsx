import { usePermission } from "@/utils/context/permission";
import { useOnLeavePageConfirmation } from "@/utils/hooks/useOnLeavePageConfirmation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export enum PrimaryButtonAction {
  Save = "Save",
  Create = "Create",
}

interface IEditableContentWrapperProps {
  children: React.ReactNode;
  onButtonClick: () => Promise<void>;
  preventNavigation: boolean;
  setPreventNavigation: (value: boolean) => void;
  primaryButtonTitle?: PrimaryButtonAction;
  returnPath: string;
  checkPermission?: boolean;
}

/**
 * Wrapper for editable content (such as forms)
 *
 * Contains footer with 2 buttons - primary button (whose title can be configured) and `Back` button
 *
 * @param children children components
 * @param onButtonClick function to call when primary button is clicked
 * @param preventNavigation When this variable is set to `true`, the user is prevented from navigating to another page
 * Furthermore, a form showing that there are unsaved changes is displayed.
 * @param setPreventNavigation function for setting `preventNavigation`
 * @param primaryButtonTitle label of the primary button
 * @param returnPath Path where to return when `Back` button is clicked
 * @constructor
 */
const EditableContentWrapper = ({
  children,
  onButtonClick,
  preventNavigation,
  setPreventNavigation,
  primaryButtonTitle = PrimaryButtonAction.Save,
  returnPath,
  checkPermission = false,
}: IEditableContentWrapperProps) => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  // const [isSaved, setIsSaved] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsSaved(false);
  // }, [preventNavigation]);

  // useEffect(() => {
  //   setPreventNavigation(!isSaved);
  // }, [isSaved]);

  const innerOnSave = async () => {
    if (onButtonClick) {
      await onButtonClick();
      setPreventNavigation(false);
    }
    // setIsSaved(true);
  };

  const { navigate, pathToNavigateTo } = useOnLeavePageConfirmation({
    preventNavigation: preventNavigation,
    onNavigate: () => {
      console.log("onNavigate called");
      setSaveDialogOpen(true);
    },
  });

  const forceClose = () => {
    setPreventNavigation(false);
    // setIsSaved(true);
    navigate();

    // this was probably causing that weird interpolation bug on next/router.
    // I'll leave it here for now, but I think it's safe to remove it in future.
    // router.push(pathToNavigateTo);
  };

  return (
    <>
      {children}
      <footer
        style={{
          width: "100vw",
          left: 0,
          position: "fixed",
          bottom: 0,
          // left: 0,
          height: "65px",
          backgroundColor: "#F6F8FA",
          zIndex: 100,
          borderTop: "1px solid #E6E8EA",
        }}
      >
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
                router.push({
                  pathname: returnPath,
                });
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              disabled={!hasPermission}
              onClick={async () => {
                await innerOnSave();
                // setIsSaved(true);
                // setPreventNavigation(false);
              }}
            >
              {primaryButtonTitle}
            </Button>
          </Stack>
        </Box>
      </footer>
      <Dialog
        open={saveDialogOpen}
        onClose={(event: any, reason: string) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            // block usage of escape key and backdrop click
            // to close dialog and force user to make a choice
            return;
          }
          setSaveDialogOpen(false);
        }}
        aria-labelledby="dont-save-dialog-title"
        aria-describedby="dont-save-dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="dont-save-dialog-title">
          {"Leave without saving changes?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have unsaved changes. Are you sure you want to leave without
            saving them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              forceClose();
            }}
            autoFocus
          >
            Ignore changes and leave
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setSaveDialogOpen(false);
            }}
          >
            Keep editing
          </Button>
        </DialogActions>
      </Dialog>
      {navigate}
    </>
  );
};

export default EditableContentWrapper;
