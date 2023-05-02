// next
import Link from "next/link";
import Image from "next/image";
// styles
import styles from "@/styles/Common/ProductItem.module.scss";

interface IProductItemProps {
  title: string;
  price: string;
  image: string;
  url: string;
}

const ProductItem = ({ title, price, image, url }: IProductItemProps) => {
  // component for rendering single product item
  return (
    <Link href={url}>
      <div className={styles.productItem}>
        <div className={styles.productItem_image}>
          <Image src={image} alt={title} fill />
        </div>
        <div className={styles.productItem_content}>
          <h3 className={styles.productItem_title}>{title}</h3>
          <span className={styles.productItem_price}>{price}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
