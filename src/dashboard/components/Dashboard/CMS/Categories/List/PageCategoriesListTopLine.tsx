import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SettingsPopover from "@/components/Dashboard/Generic/SettingsPopover";
import { useRouter } from "next/router";
import { createPageCategory } from "@/api/cms/category/category";

const PageCategoriesListTopLine = () => {
  const router = useRouter();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
    >
      <Typography variant="h4" gutterBottom>
        Page categories
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
          onClick={async () => {
            await createPageCategory().then((data) => {
              const { id } = data;
              if (!id) return;

              router.push(`/dashboard/cms/categories/${data.id}`);
            });
          }}
        >
          New page category
        </Button>
      </Stack>
    </Stack>
  );
};

export default PageCategoriesListTopLine;
