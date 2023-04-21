/**
 * /components/Footer/FooterMenu.tsx
 * This represents the bottom footer with company name and 4 column menu
 * This should be dynamic in the future
 */

// react
//next.js
import Link from "next/link";
// components
import Logo from "../Header/Logo";
// mui
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { MaxWidthWrapper } from "../MaxWidthWrapper";

const StyledFooter = styled("footer")(({ theme }) => ({
  backgroundColor: "#F5F5F5",
  marginTop: theme.spacing(8),
  padding: theme.spacing(6, 0),
}));

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const ItemHeading = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.primary,
  fontSize: "14px",
}));

const FancyListItem = styled("li")(({ theme }) => ({
  ...theme.typography.body2,
  paddingLeft: 0,
  paddingBottom: theme.spacing(1),

  textAlign: "left",
  color: theme.palette.text.secondary,
  fontSize: "14px",
  listStyleType: "none",
}));

const FooterMenu = () => {
  return (
    <StyledFooter>
      <MaxWidthWrapper>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
          }}
        >
          <Grid xs={12} md={5} lg={4}>
            <Logo />
            <Grid xs={12} md={6} lg={6}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Your satisfaction is our top priority – shop with us and
                experience the difference.
              </Typography>
            </Grid>
          </Grid>
          <Grid container xs={12} md={7} lg={8} spacing={4}>
            <Grid xs={6} lg={3}>
              <Item>
                <ItemHeading>Category A</ItemHeading>
                <Box component="ul" aria-labelledby="category-a" sx={{ pl: 2 }}>
                  <FancyListItem>Link 1.1</FancyListItem>
                  <FancyListItem>Link 1.2</FancyListItem>
                  <FancyListItem>Link 1.3</FancyListItem>
                </Box>
              </Item>
            </Grid>
            <Grid xs={6} lg={3}>
              <Item>
                <ItemHeading>Category B</ItemHeading>
                <Box component="ul" aria-labelledby="category-b" sx={{ pl: 2 }}>
                  <FancyListItem>Link 2.1</FancyListItem>
                  <FancyListItem>Link 2.2</FancyListItem>
                  <FancyListItem>Link 2.3</FancyListItem>
                </Box>
              </Item>
            </Grid>
            <Grid xs={6} lg={3}>
              <Item>
                <ItemHeading>Category C</ItemHeading>
                <Box component="ul" aria-labelledby="category-c" sx={{ pl: 2 }}>
                  <FancyListItem>Link 3.1</FancyListItem>
                  <FancyListItem>Link 3.2</FancyListItem>
                  <FancyListItem>Link 3.3</FancyListItem>
                </Box>
              </Item>
            </Grid>
            <Grid xs={6} lg={3}>
              <Item>
                <ItemHeading>Category D</ItemHeading>
                <Box component="ul" aria-labelledby="category-d" sx={{ pl: 2 }}>
                  <FancyListItem>Link 4.1</FancyListItem>
                  <FancyListItem>Link 4.2</FancyListItem>
                  <FancyListItem>Link 4.3</FancyListItem>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </MaxWidthWrapper>
    </StyledFooter>
  );
};

export default FooterMenu;
