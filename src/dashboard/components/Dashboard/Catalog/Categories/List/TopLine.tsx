import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SettingsPopover from "@/components/Dashboard/Generic/SettingsPopover";
import { useRouter } from "next/router";
import { usePermission } from "@/utils/context/permission";

/**
 * Top-line menu for Categories.
 * Contains `Categories` title & button for adding new category
 * @constructor
 */
const CategoryListTopLine = () => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
    >
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        spacing={2}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!hasPermission}
          onClick={() => {
            router.push("/dashboard/catalog/categories/add");
          }}
        >
          New category
        </Button>
      </Stack>
    </Stack>
  );
};

export default CategoryListTopLine;
