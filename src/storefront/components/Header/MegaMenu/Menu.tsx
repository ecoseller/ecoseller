import React, {
  useRef,
  useState,
  useEffect,
  RefObject,
  useCallback,
} from "react";
import PropTypes from "prop-types";

// utils
import useSWR from "swr";
import { MenuGenerator } from "./utils/MenuGenerator";

// mui
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// Components
import Logo from "../Logo";
import TopBar from "./components/TopBar";
import TopBarTitle from "./components/TopBarTitle";
import Hamburger from "./components/Hamburger";
import Nav from "./components/Nav";
import MainList from "./components/MainList";
import MegaList from "./components/MegaList";
import MainNavItem from "./components/MainNavItem";
import MainNavItemLink from "./components/MainNavItemLink";
import NavItem from "./components/NavItem";
import NavItemLink from "./components/NavItemLink";
import NavList from "./components/NavList";
import NavItemDescription from "./components/NavItemDescription";

// State Machines
import { TMenuState, MenuStateMachine } from "./utils/MenuStateMachine";
import { ICategoryMenu } from "@/types/category";

interface IMenu {
  logoImage: string;
}

const Menu = ({ logoImage }: IMenu) => {
  const [megaTMenuState, setMegaTMenuState] = useState<TMenuState>("");
  const [subTMenuState, setSubTMenuState] = useState<TMenuState>("");
  const [subSubTMenuState, setSubSubTMenuState] = useState<TMenuState>("");
  const [activeMenus, setActiveMenus] = useState<string[]>([]); // array that captures the ids of active menus
  const [isMobile, setIsMobile] = useState(true); // array that captures the ids of active menus
  const wrapperRef = useRef<HTMLDivElement>(null); // used to detect clicks outside of component

  const viewportLarge = 1024;

  const { data: categories, error: isError } = useSWR<ICategoryMenu[]>(
    "/api/category",
    (url: string) => fetch(url).then((res) => res.json())
  );

  const categoryGenerator = useCallback(
    (categories: ICategoryMenu[], level: number = 0) =>
      MenuGenerator(categories, level, activeMenus, toggleSubMenu, a11yClick),
    [categories, activeMenus]
  );

  const resetMenus = () => {
    // close all menus and empty activeMenus array
    setActiveMenus([]);
    setSubTMenuState("closed");
    setSubSubTMenuState("closed");
  };

  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      // Reset menu if clicked on outside of element
      const handleClickOutside = (e: MouseEvent | KeyboardEvent) => {
        if (
          ref.current &&
          e.target instanceof HTMLElement &&
          !ref.current.contains(e.target)
        ) {
          resetMenus();
        }
      };

      // Bind the event listener to both mouse and key events
      document.addEventListener("mousedown", handleClickOutside);
      // document.addEventListener("keydown", handleClickOutside);
      return () => {
        // Unbind the event listener to clean up
        document.removeEventListener("mousedown", handleClickOutside);
        // document.removeEventListener("keydown", handleClickOutside);
      };
    }, [ref]);
  };

  const updateActiveMenus = (state: TMenuState, menuId: string) => {
    if (state === "open") {
      // add menuId from activeMenus
      setActiveMenus([...activeMenus, menuId]);
    } else if (state === "closed") {
      // remove menuId from activeMenus
      setActiveMenus(activeMenus.filter((item) => item !== menuId));
    }
  };

  const toggleMegaMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent,
    menuId: string
  ) => {
    e.preventDefault();

    const nextState = MenuStateMachine(megaTMenuState);

    setMegaTMenuState(nextState);

    updateActiveMenus(nextState, menuId);

    if (megaTMenuState === "open") {
      resetMenus();
    }
  };

  const toggleSubMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    menuId: string
  ) => {
    e.preventDefault();

    const nextState = MenuStateMachine(subTMenuState);

    setSubTMenuState(MenuStateMachine(subTMenuState));
    /*
      I haven't come up with single solution (yet) that takes care of
      opening and closing menus for both small and large screens, so for
      now I fork the logic based on viewport size.
      */
    if (!isMobile) {
      if (activeMenus.includes(menuId)) {
        // menu is already open, remove it from activeMenus to close it
        setActiveMenus([]);
      } else {
        // menu is not yet active, add it to activeMenus to open it
        setActiveMenus([menuId]);
      }
    } else {
      // remove menuId from activeMenus
      updateActiveMenus(nextState, menuId);
    }
  };

  const toggleSubSubMenu = (
    e: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent,
    menuId: string
  ) => {
    e.preventDefault();

    const nextState = MenuStateMachine(subSubTMenuState);

    setSubSubTMenuState(MenuStateMachine(subSubTMenuState));

    updateActiveMenus(nextState, menuId);
  };

  useEffect(() => {
    if (window.innerWidth >= viewportLarge) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [activeMenus, isMobile]);

  const doEscape = (e: KeyboardEvent | React.KeyboardEvent) => {
    if (e.key === "Escape") {
      resetMenus();
    }
  };

  const a11yClick = (e: KeyboardEvent | React.KeyboardEvent) => {
    const key = e.key || e.key;
    if (key === " " || key === "Enter") {
      return true;
    }
  };

  // useEffect(() => {
  //   document.addEventListener("keydown", doEscape, false);

  //   return () => {
  //     document.removeEventListener("keydown", doEscape, false);
  //   };
  // });

  useOutsideAlerter(wrapperRef); // create bindings for closing menu from outside events

  return (
    <div role="navigation" className="rmm__root" ref={wrapperRef}>
      {/* <IconButton
        onClick={onOpenMobileMenu}
        sx={{
          color: "text.primary",
          display: { lg: "none" },
        }}
      >
        <MenuIcon />
      </IconButton> */}
      <Hamburger
        label="Menu"
        state={megaTMenuState}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          toggleMegaMenu(e, "menubar-main-categories")
        }
      />
      <Logo />
      <MainList id="menubar-main-categories" ariaLabel="Main Menu Category">
        {categories && categories.length > 0
          ? categoryGenerator(categories, 0)
          : null}
      </MainList>
    </div>
  );
};

export default Menu;
