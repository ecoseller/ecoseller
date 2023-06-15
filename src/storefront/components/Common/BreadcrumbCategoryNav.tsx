import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { IBreadcrumbObject } from "@/types/common";

interface IBreadcrumbNavProps extends IBreadcrumbObject {
  product?: { id: number; slug: string; title: string } | null;
}

/**
 * Represents category & product breadcrumb navigation
 * @param breadcrumbs individual breadcrumb links to categories
 * @param product last breadcrumb representing a product
 * @constructor
 */
const BreadcrumbCategoryNav = ({
  breadcrumbs,
  product = null,
}: IBreadcrumbNavProps) => {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        pt: 2,
      }}
    >
      {breadcrumbs?.map((item, index) => (
        <Link
          key={index}
          href={{
            pathname: `/category/${item.id}/${item.slug}`,
          }}
        >
          {item.title}
        </Link>
      ))}
      {product ? (
        <Link
          href={{
            pathname: `/product/${product.id}/${product.slug}`,
          }}
        >
          {
            /**
             * Crop title to 20 characters
             */
            product.title.length > 20
              ? `${product.title.substring(0, 20)}...`
              : product.title
          }
        </Link>
      ) : null}
    </Breadcrumbs>
  );
};

export default BreadcrumbCategoryNav;
