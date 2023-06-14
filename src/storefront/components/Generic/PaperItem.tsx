import { styled } from "@mui/material";
import Paper from "@mui/material/Paper";

/**
 * MUI Paper styled item
 */
const PaperItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body1,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
}));

export default PaperItem;
