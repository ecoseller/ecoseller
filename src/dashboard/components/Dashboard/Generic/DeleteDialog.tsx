import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface IDeleteDialog {
  open: boolean;
  setOpen: (value: boolean) => void;
  onDelete: () => void;
  text: string;
}

const DeleteDialog = ({ open, setOpen, onDelete, text }: IDeleteDialog) => {
  return (
    <Dialog
      open={open}
      onClose={(event: any, reason: string) => {
        setOpen(false);
      }}
      aria-labelledby="dont-save-dialog-title"
      aria-describedby="dont-save-dialog-description"
      disableEscapeKeyDown
    >
      {/* <DialogTitle id="dont-save-dialog-title"> */}
      {/* {"Leave without saving changes?"} */}
      {/* </DialogTitle> */}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete {text}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={async () => {
            setOpen(false);
          }}
          autoFocus
        >
          Cancel
        </Button>
        <Button
          color="error"
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
