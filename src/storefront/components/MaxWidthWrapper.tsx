/**
 * This component is used to wrap the content of the page
 * and set the max width of the content and center it
 */

import { styled } from "@mui/material";

const MAXWIDTH = "1620px";

export const MaxWidthWrapper = styled("div")(({ theme }) => ({
  maxWidth: MAXWIDTH,
  margin: "0 auto",
}));
