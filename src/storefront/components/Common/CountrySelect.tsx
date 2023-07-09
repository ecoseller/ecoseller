// next
import { useRouter } from "next/router";
// react
import { useState } from "react";
// utils
import { useTranslation } from "next-i18next";
import { useCountry } from "@/utils/context/country";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
// mui
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const CountrySelect = () => {
  const { country } = useCountry();
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        style={{
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        {country?.code ? (
          <Typography>{getUnicodeFlagIcon(country?.code)}</Typography>
        ) : null}
      </span>
      <CountrySelectModal open={open} setOpen={setOpen} />
    </>
  );
};

export default CountrySelect;

const style = {
  position: "absolute",
  // left: "10%",
  overflow: "scroll",
  height: "80%",
  display: "block",
  // position: "absolute" as "absolute",
  // overflow: "scroll",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  "&:focus": {
    outline: "none",
  },
};

const CountrySelectModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { countryList, country, setCountryCookieAndLocale } = useCountry();
  const router = useRouter();
  const { pathname, asPath, query } = router
  const { t } = useTranslation("common");
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("select-country") /* Select your country */}
        </Typography>
        <List>
          {countryList?.map((c) => (
            <ListItem disablePadding key={c.code}>
              <ListItemButton
                selected={country && c.code == country.code ? true : false}
              >
                <ListItemText
                  primary={`${getUnicodeFlagIcon(c.code)} ${c.name}`}
                  secondary={c.locale}
                  onClick={() => {
                    setCountryCookieAndLocale(c.code);
                    setOpen(false);
                    router.push({ pathname, query }, asPath, { locale: c.locale }).then(() => router.reload());
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};
