/**
 * /components/Header/Icons/Search.tsx
 * Search icon component for the header menu
 */

// mui
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const Cart = ({}) => {
  return (
    <IconButton size="small" sx={{ ml: 2 }}>
      <SearchIcon />
    </IconButton>
  );
};

export default Cart;
