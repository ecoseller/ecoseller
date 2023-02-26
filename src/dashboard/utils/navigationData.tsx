import ShowChartIcon from "@mui/icons-material/ShowChart";
import CategoryIcon from "@mui/icons-material/Category";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

export interface INavigationItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
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
    title: "Products",
    path: "/dashboard/products",
    icon: <InventoryIcon />,
  },
  {
    title: "Categories",
    path: "/dashboard/categories",
    icon: <CategoryIcon />,
  },
  {
    title: "CMS",
    path: "/dashboard/cms",
    icon: <ArticleIcon />,
  },
  {
    title: "Roles & Users",
    path: "/dashboard/users-roles",
    icon: <GroupIcon />,
  },
];

export default navigationData;
