// next.js
import Link from "next/link";
// @mui
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useRouter } from "next/router";
import { INavigationItem } from "@/utils/navigationData";

interface INavigationProps {
  data: INavigationItem[];
}

const Navigation = ({ data = [], ...other }: INavigationProps) => {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1, px: 2.5 }}>
        {data.map((item) => (
          <NavigationItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
};

export default Navigation;

// ----------------------------------------------------------------------
const StyledNavigationItem = styled((props: any) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: "relative",
  textTransform: "capitalize",
  color: theme.palette.text.primary,
  // fontWeight: "fontWeightBold",
  borderRadius: theme.shape.borderRadius,
  ":hover": {
    backgroundColor: "#F6F1F9",
  },
}));

const StyledNavivationItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// ----------------------------------------------------------------------

interface INavigationItemProps {
  item: INavigationItem;
}

function NavigationItem({ item }: INavigationItemProps) {
  const { title, path, icon, info } = item;

  const { pathname } = useRouter();

  return (
    <StyledNavigationItem
      component={Link}
      to={path}
      selected={pathname === path}
      sx={{
        "&.active": {
          color: "text.primary",
          bgcolor: "action.selected",
          fontWeight: "fontWeightBold",
        },
      }}
    >
      <StyledNavivationItemIcon>{icon && icon}</StyledNavivationItemIcon>

      <ListItemText
        disableTypography
        primary={title}
        sx={{ primary: { textDecoration: "none" } }}
      />

      {info && info}
    </StyledNavigationItem>
  );
}
