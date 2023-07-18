import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";

const PageCategoryTypeListTopLine = () => {
  const router = useRouter();
  return (
    <Box sx={{ pt: 5 }}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Page category types
        </Typography>
      </Box>
      <Box>
        <Typography variant="caption" gutterBottom>
          {`Page category types are used to group page categories together. For
          example, you can create a category type called "About us" and "About
          product" then create a category type called "FOOTER" and "HEADER" and
          fetch those categories by their type.`}
        </Typography>
      </Box>
    </Box>
  );
};

export default PageCategoryTypeListTopLine;
