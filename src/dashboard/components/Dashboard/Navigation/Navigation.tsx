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
import { useEffect, useState } from "react";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import Collapse from "@mui/material/Collapse";

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

interface INavigationItemProps {
  item: INavigationItem;
  sx?: any;
  onClick?: () => void;
}

function NavigationItem({ item, sx, onClick }: INavigationItemProps) {
  /**
   * Main Navigation Item divided into 2 parts - main-item and sub-navigation where sub-navigation is a list of children
   * @param item - navigation item - see utils/navigationData.ts
   * @param sx - style props
   */

  const { title, path, icon, info, children, level } = item;

  const { pathname } = useRouter();

  const [open, setOpen] = useState(pathname.includes(path));
  const [timeout, setTimeout] = useState<"auto" | number>("auto");

  useEffect(() => {
    setOpen(pathname.includes(path));
  }, [pathname]);

  if (children && children.length > 0) {
    // generate item and sub-navigation
    // if the item has children
    // add a collapse component
    // add a nesting level to the children
    // so that they are indented - see sx prop

    return (
      <>
        <StyledNavigationItem
          onClick={() => {
            setOpen(!open);
            // onClick && onClick();
          }}
          selected={path.includes(pathname)}
          sx={{
            ...sx,
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

          <StyledNavivationItemIcon>
            {open ? <ExpandLess /> : <ExpandMore />}
          </StyledNavivationItemIcon>
        </StyledNavigationItem>
        <Collapse in={open} timeout={"auto"} unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => (
              <NavigationItem
                onClick={() => {
                  setTimeout(0);
                }}
                key={child.title}
                item={{
                  ...child,
                  path: `${path}${child.path}`, // add parent path
                  level: level ? level + 2 : 2, // add nesting level
                }}
                sx={{ pl: 2 + (level ? level : 0) }} // level of nesting
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  // basic situation - no children
  return (
    <StyledNavigationItem
      component={Link}
      to={path}
      selected={pathname === path}
      sx={{
        ...sx,
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
