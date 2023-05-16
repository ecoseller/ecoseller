import { useCart } from "@/utils/context/cart";
import Button from "@mui/material/Button";

const ProductPage = ({}) => {
  const { addToCart } = useCart();
  return (
    <>
      <h1>Product page</h1>
      <Button
        onClick={() => {
          console.log("add to cart");
          addToCart("espresso250", 1);
        }}
      >
        add to cart
      </Button>
    </>
  );
};

export default ProductPage;
