/**
 * /components/Header/Icons/Cart.tsx
 * Cart icon component for the header menu
 */

// mui
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@/utils/context/cart";
import { useRouter } from "next/router";

const Cart = ({}) => {
  const { getCartSize } = useCart();
  const router = useRouter();

  return (
    <IconButton
      size="small"
      sx={{ ml: 2 }}
      onClick={() => router.push("/cart")}
    >
      <Badge badgeContent={getCartSize()} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default Cart;
