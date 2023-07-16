import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SettingsPopover from "@/components/Dashboard/Generic/SettingsPopover";
import { useRouter } from "next/router";
import { usePermission } from "@/utils/context/permission";

const ProductListTopLine = () => {
  const { hasPermission } = usePermission();

  const router = useRouter();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
    >
      <Typography variant="h4" gutterBottom>
        Products
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
            router.push("/dashboard/catalog/products/add");
          }}
        >
          New product
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProductListTopLine;
