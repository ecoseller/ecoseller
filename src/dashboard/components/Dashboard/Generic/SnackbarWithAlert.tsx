import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { ISnackbarData } from "@/utils/snackbar";


interface ISnackbarWithAlertProps
{
  snackbarData: ISnackbarData;
  setSnackbar: (data: ISnackbarData | null) => void;
}

/**
 * Component containing snackbar with alert
 * @param snackbarData snackbar data
 * @param setSnackbar function for setting snackbar data
 * @constructor
 */
const SnackbarWithAlert = ({ snackbarData, setSnackbar }: ISnackbarWithAlertProps) =>
{
  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) =>
  {
    if (reason === "clickaway")
    {
      return;
    }
    setSnackbar(null);
  };


  return (
    <Snackbar
      open={snackbarData.open}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarData.severity}
        sx={{ width: "100%" }}
      >
        {snackbarData.message}
      </Alert>
    </Snackbar>
  );
};
export default SnackbarWithAlert;
