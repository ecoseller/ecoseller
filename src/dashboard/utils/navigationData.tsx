import ShowChartIcon from "@mui/icons-material/ShowChart";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LanguageIcon from "@mui/icons-material/Language";
import MoneyIcon from "@mui/icons-material/Money";
export interface INavigationItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  children?: INavigationItem[]; // path of children is relative to parent
  level?: number;
}

const navigationData: INavigationItem[] = [
  {
    title: "Overview",
    path: "/dashboard/overview",
    icon: <ShowChartIcon />,
  },
  {
    title: "Orders",
    path: "/dashboard/orders",
    icon: <ShoppingBasketIcon />,
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
      },
    ],
  },
  {
    title: "Localization",
    path: "/dashboard/localization",
    icon: <LanguageIcon />,
    children: [
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
  },
];

export default navigationData;
