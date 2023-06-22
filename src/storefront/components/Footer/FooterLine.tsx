/**
 * /components/Footer/FooterLine.tsx
 * This represents the bottom footer line with the company name, terms and privacy links
 */

// react
//next
// components
// mui
import styled from "@mui/material/styles/styled";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { MaxWidthWrapper } from "../MaxWidthWrapper";
import { useCountry } from "@/utils/context/country";
import { useCookie } from "@/utils/context/cookies";
import CookieDisclaimer from "../Common/CookieDisclaimer";

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: "#F5F5F5",
}));

const FooterContainer = styled("div")(({ theme }) => ({
  backgroundColor: "#222222",
}));

const Footer = () => {
  const { country } = useCountry();

  console.log(country);

  const { cookieState, toggleDisclaimer } = useCookie();

  return (
    <FooterContainer>
      <MaxWidthWrapper>
        <Grid
          xs={12}
          container
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          sx={{ fontSize: "12px", color: "#0000" }}
        >
          <Grid
            container
            columnSpacing={1}
            sx={{ pr: 2, order: { xs: 2, sm: 1 } }}
          >
            <Grid>
              <Item>GreatCompany © 2023</Item>
            </Grid>
            <Grid>
              <Item>Privacy Policy</Item>
            </Grid>
            <Grid>
              <Item>Terms of Service</Item>
            </Grid>
            <Grid>
              <Item onClick={() => toggleDisclaimer(true)}>Cookies</Item>
            </Grid>
          </Grid>
        </Grid>
      </MaxWidthWrapper>
      <CookieDisclaimer
        open={cookieState?.openDisclaimer}
        setOpen={(value: boolean) => {
          toggleDisclaimer(value);
        }}
      />
    </FooterContainer>
  );
};

export default Footer;
