import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ICollapsableContentWithTitleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * Component containing title and collapsible content below it
 * @param title Title of the component
 * @param children Elements located in the collapsible part
 * @param defaultOpen Is the content open by default?
 * @constructor
 */
const CollapsableContentWithTitle = ({
  title,
  children,
  defaultOpen = false,
}: ICollapsableContentWithTitleProps) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Button variant="text" onClick={() => setOpen(!open)}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Button>
      </Stack>
      {open ? <>{children}</> : null}
    </>
  );
};
export default CollapsableContentWithTitle;
