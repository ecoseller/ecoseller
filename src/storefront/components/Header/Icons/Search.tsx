/**
 * /components/Header/Icons/Search.tsx
 * Search icon component for the header menu
 */

// react
import { useState } from "react";
// utils
import { useTranslation } from "next-i18next";
// mui
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";

const SearchButton = ({
  mobile,
  mobileOpen,
  setMobileOpen,
}: {
  mobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { t } = useTranslation("common");

  const handleClickSearch = () => {
    if (query === "") return;
    router.push(`/search/${query}`);
  };

  if (mobile && !mobileOpen)
    return (
      <IconButton
        onClick={() => setMobileOpen(true)}
        edge="end"
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    );

  return (
    <>
      <FormControl
        sx={{
          m: 1,
          width: "20ch",
        }}
        variant="outlined"
      >
        <InputLabel htmlFor="outlined-adornment-password">
          {t("search-label")}
        </InputLabel>
        <OutlinedInput
          type="text"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Search"
          onChange={(e) => setQuery(e.target.value)}
        />
      </FormControl>
      {mobile && mobileOpen && (
        <IconButton
          onClick={() => setMobileOpen(false)}
          edge="end"
          aria-label="search"
        >
          <CloseIcon />
        </IconButton>
      )}
    </>
  );
};

export default SearchButton;
