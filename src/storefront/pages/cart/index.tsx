import { ICart } from "@/types/cart";
import { NextApiRequest, NextApiResponse, NextPageContext } from "next";
import { cartDetailAPI } from "@/pages/api/cart/[token]";
import { useCart } from "@/utils/context/cart";

interface ICartPageProps {
  cart: ICart;
}

const CartPage = ({ cart }: ICartPageProps) => {
  const { addToCart } = useCart();

  return (
    <>
      <h1>Cart items</h1>
      <table>
        {cart.cart_items.map((i) => (
          <tr key={i.product_variant}>
            <td>{i.product_variant}</td>
            <td>{i.unit_price_gross}</td>
            <td>{i.quantity}</td>
          </tr>
        ))}
      </table>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { req, res } = context;
  const token = "95ad1b42-8011-47c2-8335-b704dbf1ec3a";

  const cart: ICart = await cartDetailAPI(
    "GET",
    token,
    req as NextApiRequest,
    res as NextApiResponse
  );

  return { props: { cart: cart } };
}

export default CartPage;
