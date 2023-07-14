// next
import Link from "next/link";
import Image from "next/image";
// styles
import styles from "@/styles/Common/ProductItem.module.scss";
import { useRouter } from "next/router";
import { useRecommender } from "@/utils/context/recommender";

interface IProductItemProps {
  title: string;
  price: string;
  image: string;
  url: string;
}

const ProductItem = ({ title, price, image, url }: IProductItemProps) => {
  // component for rendering single product item
  const router = useRouter();
  const { sendEvent } = useRecommender();
  return (
    // <Link href={url}>
    <div
      className={styles.productItem}
      onClick={() => {
        sendEvent("RECOMMENDATION_VIEW", {
          id: 42,
        });
        // this push will need to be changed to a link to the product page
        router.push(url, undefined, { shallow: false });
      }}
    >
      <div className={styles.productItem_image}>
        <Image src={image} alt={`Product recommendation`} fill />
      </div>
      <div className={styles.productItem_content}>
        <h3 className={styles.productItem_title}>{title}</h3>
        <span className={styles.productItem_price}>{price}</span>
      </div>
    </div>
    // </Link>
  );
};

export default ProductItem;
