/**
 * /components/Header/Icons/Cart.tsx
 * Cart icon component for the header menu
 */

// mui
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Cart = ({}) => {
  return (
    <IconButton size="small" sx={{ ml: 2 }}>
      <Badge badgeContent={0} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default Cart;
