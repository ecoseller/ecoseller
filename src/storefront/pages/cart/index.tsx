import { getCart } from "@/api/cart";
import { Cart } from "@/types/cart";

interface ICartPageProps {
  cart: Cart;
}

const CartPage = ({ cart }: ICartPageProps) => {
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

export async function getServerSideProps() {
  const cart = await getCart();

  return { props: { cart: cart } };
}

export default CartPage;
