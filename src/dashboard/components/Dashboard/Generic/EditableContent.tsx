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
import footerStyles from "./Footer.module.scss";

const PRODUCTLIST_PATH = "/dashboard/catalog/products";

interface IDashboardContentWithSaveFooter {
  children: React.ReactNode;
  onSave?: () => Promise<void>;
  preventNavigation: boolean;
  setPreventNavigation: (value: boolean) => void;
  primaryButtonTitle?: string;
}
const DashboardContentWithSaveFooter = ({
  children,
  onSave,
  preventNavigation,
  setPreventNavigation,
  primaryButtonTitle = "Save",
}: IDashboardContentWithSaveFooter) => {
  const router = useRouter();

  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  // const [isSaved, setIsSaved] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsSaved(false);
  // }, [preventNavigation]);

  // useEffect(() => {
  //   setPreventNavigation(!isSaved);
  // }, [isSaved]);

  const innerOnSave = async () => {
    if (onSave) {
      await onSave();
      // setPreventNavigation(false);
    }
    // setIsSaved(true);
  };

  const { navigate, pathToNavigateTo } = useOnLeavePageConfirmation({
    preventNavigation: preventNavigation,
    onNavigate: () => {
      setSaveDialogOpen(true);
    },
  });

  const forceClose = () => {
    setPreventNavigation(false);
    // setIsSaved(true);
    navigate();
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
                router.push("/dashboard/catalog/products");
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
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

export default DashboardContentWithSaveFooter;
