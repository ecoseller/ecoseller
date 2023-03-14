// react
import { useState } from "react";
// mui
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
// mui icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ICollapsableContentWithTitleProps {
  title: string;
  children: React.ReactNode;
}

const CollapsableContentWithTitle = ({
  title,
  children,
}: ICollapsableContentWithTitleProps) => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        // mb={5}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Button variant="outlined" onClick={() => setOpen(!open)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </Stack>
      {open ? <>{children}</> : null}
    </>
  );
};
export default CollapsableContentWithTitle;
