import { ICategoryMenu } from "@/types/category";
import MainNavItem from "../components/MainNavItem";
import MainNavItemLink from "../components/MainNavItemLink";
import MegaList from "../components/MegaList";
import NavList from "../components/NavList";
import NavItem from "../components/NavItem";
import NavItemLink from "../components/NavItemLink";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const MenuGenerator = (
  categories: ICategoryMenu[],
  level: number,
  activeMenus: string[],
  toggleSubMenu: (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    id: string
  ) => void,
  a11yClick: (e: KeyboardEvent | React.KeyboardEvent) => boolean | undefined
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
        a11yClick
      );
    }
    let cat = null;
    switch (level) {
      case 0:
        console.log("level 0 has children", category.title, children);
        // create top level category nav item
        cat = (
          <MainNavItem id={`nav-${category.id}`} role="none" isChildren>
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
              // onKeyDown={
              //   children && children?.length > 0
              //     ? (e) =>
              //         a11yClick(e) &&
              //         toggleSubMenu(e, `nav-mega-${category.id}`)
              //     : undefined
              // }
              ariaHaspopup={
                children && children?.length > 0 ? "menu" : undefined
              }
              ariaControls="nav-menu"
            >
              {category.title}
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
                  // onClick={(e: any) => toggleSubMenu(e, `nav-${category.id}`)}
                  // onKeyDown={(e: any) =>
                  //   a11yClick(e) && toggleSubMenu(e, `nav-${category.id}`)
                  // }
                  ariaHaspopup="true"
                  isHeading
                >
                  {category.title}
                </NavItemLink>
                {children}
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
                {category.title}
              </NavItemLink>
            </NavItem>
          );
        }
        break;
      default:
        cat = (
          <NavItem id={`nav-mega-${category.id}-Sub-menu-item`} role="none">
            <NavItemLink
              id={`navitem-mega-${category.id}-Sub-menu-item`}
              role="menuitem"
              href={`/category/${category.id}/${category.slug}`}
              // onClick={(e: any) => toggleSubMenu(e, `nav-${category.id}`)}
              // onKeyDown={(e: any) =>
              //   a11yClick(e) && toggleSubMenu(e, `nav-${category.id}`)
              // }
              ariaHaspopup="false"
            >
              {category.title}
            </NavItemLink>
          </NavItem>
        );
        break;
    }
    categoryList.push(cat);
  });
  console.log("categoryList", categoryList);
  return categoryList;
};
