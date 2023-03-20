import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import SettingsPopover from "@/components/Dashboard/Generic/SettingsPopover";
import { useRouter } from "next/router";

const ProductListTopLine = () => {
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
        <SettingsPopover>
          <Button sx={{ p: 2 }}>Import</Button>
          <Button sx={{ p: 2 }}>Export</Button>
        </SettingsPopover>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
