// next.js
import { useRouter } from "next/router";
// mui
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface ITopLineWithReturnProps {
  title: string;
  returnPath: string;
}

/**
 * Component displaying top line with `Return` button and title
 * @param title Title displayed
 * @param returnPath URL where to navigate when `Return` button is clicked
 * @constructor
 */
const TopLineWithReturn = ({ title, returnPath }: ITopLineWithReturnProps) => {
  const router = useRouter();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="left"
      mb={3}
      spacing={2}
    >
      <Button
        variant="text"
        onClick={() => {
          router.push(returnPath);
        }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
    </Stack>
  );
};

export default TopLineWithReturn;
