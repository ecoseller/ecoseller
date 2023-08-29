import ShowChartIcon from "@mui/icons-material/ShowChart";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LanguageIcon from "@mui/icons-material/Language";
import MoneyIcon from "@mui/icons-material/Money";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReviewsIcon from "@mui/icons-material/Reviews";

import { ContextPermissions } from "./context/permission";
export interface INavigationItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: INavigationItem[]; // path of children is relative to parent
  level?: number;
  permissions?: ContextPermissions[];
}

const navigationData: INavigationItem[] = [
  {
    title: "Overview",
    path: "/dashboard/overview",
    icon: <ShowChartIcon />,
  },
  {
    title: "Cart",
    path: "/dashboard/cart",
    icon: <ShoppingBasketIcon />,
    children: [
      {
        title: "Shipping methods",
        path: "/shipping-method",
        icon: undefined,
      },
      {
        title: "Payment methods",
        path: "/payment-method",
        icon: undefined,
      },
    ],
  },
  {
    title: "Orders",
    path: "/dashboard/orders",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Reviews",
    path: "/dashboard/reviews",
    icon: <ReviewsIcon />,
  },
  {
    title: "Catalog",
    path: "/dashboard/catalog",
    icon: <InventoryIcon />,
    children: [
      {
        title: "Products",
        path: "/products",
        icon: undefined,
        permissions: ["product_change_permission", "product_add_permission"],
      },
      {
        title: "Product types",
        path: "/product-types",
        icon: undefined,
      },
      {
        title: "Attributes",
        path: "/attribute/type",
        icon: undefined,
      },
      {
        title: "Categories",
        path: "/categories",
        icon: undefined,
        permissions: ["category_change_permission", "category_add_permission"],
      },
    ],
  },
  {
    title: "Localization",
    path: "/dashboard/localization",
    icon: <LanguageIcon />,
    children: [
      {
        title: "Countries",
        path: "/countries",
        icon: undefined,
      },
      {
        title: "Vat groups",
        path: "/vat-groups",
        icon: undefined,
      },
      {
        title: "Price lists",
        path: "/price-lists",
        icon: undefined,
      },
      {
        title: "Currency",
        path: "/currencies",
        icon: undefined,
      },
    ],
  },
  {
    title: "CMS",
    path: "/dashboard/cms",
    icon: <ArticleIcon />,
    permissions: ["page_change_permission", "page_add_permission"],
    children: [
      {
        title: "Pages",
        path: "/pages",
        icon: undefined,
      },
      {
        title: "Categories & Types",
        path: "/categories",
        icon: undefined,
      },
    ],
  },
  {
    title: "Users & Roles",
    path: "/dashboard/users-roles",
    icon: <GroupIcon />,
    permissions: [
      "user_change_permission",
      "user_add_permission",
      "group_change_permission",
      "group_add_permission",
    ],
  },
  {
    title: "Recommender System",
    path: "/dashboard/recommender-system",
    icon: <StarIcon />,
    permissions: ["page_change_permission", "page_add_permission"],
    children: [
      {
        title: "Performance",
        path: "/performance",
        icon: undefined,
      },
      {
        title: "Training",
        path: "/training",
        icon: undefined,
      },
      {
        title: "Configuration",
        path: "/configuration",
        icon: undefined,
      },
    ],
  },
];

export default navigationData;
