/**
 * /components/Header/TopLine.tsx
 * Top line component for the header menu
 * It contains some main links (like contact, about, etc.)
 */

// react
//next.js
// mui
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { MaxWidthWrapper } from "../MaxWidthWrapper";
import Grid from "@mui/material/Unstable_Grid2";
import CountrySelect from "../Common/CountrySelect";
import useSWR from "swr";
import { IPageCategory } from "@/types/cms";
// components
// utils

const MAXWIDTH = 1620;

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.typography.subtitle1.color,
}));

const TopLineContainer = styled("div")(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const TopLine = () => {
  const { data } = useSWR<IPageCategory[]>(
    `/api/cms/type/HEADER`,
    (url: string) => fetch(url).then((res) => res.json())
  );

  console.log(
    "HEADER",
    data?.map((category) => category?.page?.map((page) => page?.title))
  );
  return (
    <TopLineContainer>
      <MaxWidthWrapper>
        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          sx={{ fontSize: "12px" }}
        >
          <div className="container">
            <Grid
              container
              columnSpacing={1}
              sx={{ pr: 2, order: { xs: 2, sm: 1 } }}
            >
              {data?.map((category) =>
                category?.page?.map((page) => (
                  <Grid>
                    <Item>
                      <Typography
                        variant="subtitle2"
                        sx={{ flexGrow: 1 }}
                        component={Link}
                        href={`/${page?.slug}`}
                        shallow={false}
                        prefetch={false}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        {page?.title}
                      </Typography>
                    </Item>
                  </Grid>
                ))
              )}
              <Grid>
                <Item>
                  <CountrySelect />
                </Item>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </MaxWidthWrapper>
    </TopLineContainer>
  );
};

export default TopLine;
