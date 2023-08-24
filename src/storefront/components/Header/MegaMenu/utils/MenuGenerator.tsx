import { ICategoryBase } from "@/types/category";
import MainNavItem from "../components/MainNavItem";
import MainNavItemLink from "../components/MainNavItemLink";
import MegaList from "../components/MegaList";
import NavList from "../components/NavList";
import NavItem from "../components/NavItem";
import NavItemLink from "../components/NavItemLink";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";

export const MenuGenerator = (
  categories: ICategoryBase[],
  level: number,
  activeMenus: string[],
  toggleSubMenu: (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void,
  toggleSubSubMenu: (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void,
  a11yClick: (e: KeyboardEvent | React.KeyboardEvent) => boolean | undefined,
  isMobile: boolean = false
): JSX.Element[] => {
  let categoryList: JSX.Element[] = [];

  categories.forEach((category) => {
    let children: JSX.Element[] = [];
    if (category.children.length > 0) {
      children = MenuGenerator(
        category.children,
        level + 1,
        activeMenus,
        toggleSubMenu,
        toggleSubSubMenu,
        a11yClick,
        isMobile
      );
    }
    let cat = null;

    switch (level) {
      case 0:
        console.log("level 0 has children", category.title, children);
        // create top level category nav item
        cat = (
          <MainNavItem
            id={`nav-${category.id}`}
            role="none"
            isChildren={children && children?.length > 0 ? true : false}
          >
            <MainNavItemLink
              id={`nav-item-${category.id}`}
              role="menuitem"
              href={`/category/${category.id}/${category.slug}`}
              isForward={children && children?.length > 0 ? true : false}
              isActive={
                children &&
                children?.length > 0 &&
                !!activeMenus.includes(`nav-mega-${category.id}`)
                  ? true
                  : false
              }
              onClick={
                children && children?.length > 0
                  ? (e) => toggleSubMenu(e, `nav-mega-${category.id}`)
                  : undefined
              }
              onMouseEnter={
                children && children?.length > 0
                  ? (e) => toggleSubMenu(e, `nav-mega-${category.id}`)
                  : undefined
              }
              ariaHaspopup={
                children && children?.length > 0 ? "menu" : undefined
              }
              ariaControls="nav-menu"
              isMobile={isMobile}
              isBack
            >
              <Typography variant={"h3"} fontSize={"1.0rem"} fontWeight={600}>
                {category.title}
              </Typography>
            </MainNavItemLink>
            {children && children?.length > 0 ? (
              <MegaList
                id={`nav-mega-${category.id}`}
                activeState={
                  activeMenus.includes(`nav-mega-${category.id}`)
                    ? "open"
                    : "closed"
                }
              >
                <NavItem id="nav-Mega-Menu-back" isHeading={true}>
                  <NavItemLink
                    id="menuitem-Mega-Menu-back"
                    href={`/category/${category.id}/${category.slug}`}
                    onClick={(e) => toggleSubMenu(e, `nav-mega-${category.id}`)}
                    onKeyDown={(e) =>
                      a11yClick(e) &&
                      toggleSubMenu(e, `nav-mega-${category.id}`)
                    }
                    ariaControls="nav-main-Mega-Menu"
                    isMobile={isMobile}
                    isBack
                  >
                    <Typography
                      variant={"h3"}
                      fontSize={"1.0rem"}
                      fontWeight={600}
                    >
                      {category.title}
                    </Typography>
                  </NavItemLink>
                </NavItem>
                {children}
              </MegaList>
            ) : null}
          </MainNavItem>
        );
        break;
      case 1:
        // create sub level category nav item
        if (children && children?.length > 0) {
          // with children (so we create <NavList>)
          cat = (
            <>
              <NavItem id={`nav-mega-${category.id}-Sub-menu-item`} role="none">
                <NavItemLink
                  id={`navitem-mega-${category.id}-Sub-menu-item`}
                  role="menuitem"
                  href={`/category/${category.id}/${category.slug}`}
                  onClick={(e: any) =>
                    toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                  }
                  ariaHaspopup="true"
                  isMobile={isMobile}
                  isForward
                >
                  <Typography
                    variant={"h6"}
                    fontSize={"0.85rem"}
                    fontWeight={600}
                  >
                    {category.title}
                  </Typography>
                </NavItemLink>
                <NavList
                  id={`subsubmenu-${category.id}`}
                  role="menu"
                  isSub
                  isSubSub
                  activeState={
                    activeMenus.includes(`subsubmenu-${category.id}`)
                      ? "open"
                      : "closed"
                  }
                  ariaLabelledby={`menuitem-menu-Mega-Menu-Sub-menu-item-${category.id}`}
                >
                  <NavItem
                    id={`nav-Mega-Menu-Sub-menu-item-${category.id}`}
                    role="none"
                    isHeading
                  >
                    <NavItemLink
                      id={`menuitem-Mega-Menu-Sub-menu-item-${category.id}`}
                      role="menuitem"
                      href={`/category/${category.id}/${category.slug}`}
                      isBack
                      onClick={(e: any) =>
                        toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                      }
                      onKeyDown={(e) =>
                        a11yClick(e) &&
                        toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                      }
                      ariaHaspopup="true"
                      ariaControls={`subsubmenu-${category.id}`}
                      isMobile={isMobile}
                    >
                      <Typography
                        variant={"h6"}
                        fontSize={"0.85rem"}
                        fontWeight={600}
                      >
                        {category.title}
                      </Typography>
                    </NavItemLink>
                  </NavItem>
                  {children}
                </NavList>
              </NavItem>
            </>
          );
        } else {
          // has no children, so we don't create a <NavList>
          cat = (
            <NavItem id={`nav-mega-${category.id}-Sub-menu-item`} role="none">
              <NavItemLink
                id={`navitem-mega-${category.id}-Sub-menu-item`}
                role="menuitem"
                href={`/category/${category.id}/${category.slug}`}
                ariaHaspopup="false"
                isHeading
              >
                <Typography
                  variant={"h6"}
                  fontSize={"0.85rem"}
                  fontWeight={600}
                >
                  {category.title}
                </Typography>
              </NavItemLink>
            </NavItem>
          );
        }
        break;
      default:
        // create sub level category nav item
        if (children && children?.length > 0) {
          // with children (so we create <NavList>)
          cat = (
            <>
              <NavItem id={`nav-mega-${category.id}-Sub-menu-item`} role="none">
                <NavItemLink
                  id={`navitem-mega-${category.id}-Sub-menu-item`}
                  role="menuitem"
                  href={`/category/${category.id}/${category.slug}`}
                  onClick={(e: any) =>
                    toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                  }
                  ariaHaspopup="true"
                  isMobile={isMobile}
                  isForward
                >
                  <Typography
                    variant={"h6"}
                    fontSize={"0.85rem"}
                    fontWeight={400}
                  >
                    {category.title}
                  </Typography>
                </NavItemLink>
                <NavList
                  id={`subsubmenu-${category.id}`}
                  role="menu"
                  isSub
                  isSubSub
                  activeState={
                    activeMenus.includes(`subsubmenu-${category.id}`)
                      ? "open"
                      : "closed"
                  }
                  ariaLabelledby={`menuitem-menu-Mega-Menu-Sub-menu-item-${category.id}`}
                >
                  <NavItem
                    id={`nav-Mega-Menu-Sub-menu-item-${category.id}`}
                    role="none"
                    isHeading
                  >
                    <NavItemLink
                      id={`menuitem-Mega-Menu-Sub-menu-item-${category.id}`}
                      role="menuitem"
                      href={`/category/${category.id}/${category.slug}`}
                      isBack
                      onClick={(e: any) =>
                        toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                      }
                      onKeyDown={(e) =>
                        a11yClick(e) &&
                        toggleSubSubMenu(e, `subsubmenu-${category.id}`)
                      }
                      ariaHaspopup="true"
                      ariaControls={`subsubmenu-${category.id}`}
                      isMobile={isMobile}
                    >
                      <Typography
                        variant={"h6"}
                        fontSize={"0.85rem"}
                        fontWeight={400}
                      >
                        {category.title}
                      </Typography>
                    </NavItemLink>
                  </NavItem>
                  {children}
                </NavList>
              </NavItem>
            </>
          );
        } else {
          // has no children, so we don't create a <NavList>
          cat = (
            <NavItem id={`nav-mega-${category.id}-Sub-menu-item`} role="none">
              <NavItemLink
                id={`navitem-mega-${category.id}-Sub-menu-item`}
                role="menuitem"
                href={`/category/${category.id}/${category.slug}`}
                ariaHaspopup="false"
                isHeading
              >
                <Typography
                  variant={"h6"}
                  fontSize={"0.85rem"}
                  fontWeight={300}
                >
                  {category.title}
                </Typography>
              </NavItemLink>
            </NavItem>
          );
        }
        break;
    }
    categoryList.push(cat);
  });
  console.log("categoryList", categoryList);
  return categoryList;
};
