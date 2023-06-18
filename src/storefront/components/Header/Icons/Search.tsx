/**
 * /components/Header/Icons/Search.tsx
 * Search icon component for the header menu
 */

// react
import { useState } from "react";

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
import { useRouter } from "next/router";

const SearchButton = ({}) => {
  // return !open ? (
  //   <IconButton
  //     size="small"
  //     sx={{ ml: 2 }}
  //     onClick={() => {
  //       setOpen(true);
  //     }}
  //   >
  //     <SearchIcon />
  //   </IconButton>
  // ) : (
  //   <>

  //   </>
  // );

  const [query, setQuery] = useState("");

  const router = useRouter();

  const handleClickSearch = () => {
    if (query === "") return;
    router.push(`/search/${query}`);
  };

  return (
    <FormControl sx={{ m: 1, width: "20ch" }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
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
  );
};

export default SearchButton;
