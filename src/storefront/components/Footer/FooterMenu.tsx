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
import useSWR from "swr";
import { IPageCategory } from "@/types/cms";

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
  const { data } = useSWR<IPageCategory[]>(
    `api/cms/type/FOOTER`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  console.log("FOOTER", data);

  return (
    <StyledFooter>
      <MaxWidthWrapper>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
          }}
          style={{
            width: "100%",
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
            {data?.map((category) => (
              <Grid xs={6} lg={3} key={category.id}>
                <Item>
                  <ItemHeading>{category.title}</ItemHeading>
                  <Box
                    component="ul"
                    aria-labelledby="category-a"
                    sx={{ pl: 2 }}
                  >
                    {category?.page?.map((page) => (
                      <Link href={page.slug} key={page.id}>
                        <FancyListItem>{page.title}</FancyListItem>
                      </Link>
                    ))}
                  </Box>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </MaxWidthWrapper>
    </StyledFooter>
  );
};

export default FooterMenu;
