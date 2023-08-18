// next
import Link from "next/link";
import Image from "next/image";
// styles
import styles from "@/styles/Common/ProductItem.module.scss";
import { useRouter } from "next/router";
import { useRecommender } from "@/utils/context/recommender";

interface IProductItemProps {
  title: string;
  product_id: number;
  product_variant_sku: string;
  price: string;
  image: string;
  url: string;
  rs_info: any;
}

const ProductItem = ({
  title,
  product_id,
  product_variant_sku,
  price,
  image,
  url,
  rs_info,
}: IProductItemProps) => {
  // component for rendering single product item
  const router = useRouter();
  const { sendEvent } = useRecommender();
  return (
    // <Link href={url}>
    <div
      className={styles.productItem}
      onClick={() => {
        sendEvent("PRODUCT_DETAIL_ENTER", {
          product_id,
          product_variant_sku,
          ...rs_info,
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
