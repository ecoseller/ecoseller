import React, {
  useRef,
  useState,
  useEffect,
  RefObject,
  useCallback,
} from "react";

// utils
import useSWR from "swr";
import { MenuGenerator } from "./utils/MenuGenerator";

// mui
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// Components
import Logo from "../Logo";
import Nav from "./components/Nav";
import MainList from "./components/MainList";

// State Machines
import { TMenuState, MenuStateMachine } from "./utils/MenuStateMachine";
import { ICategoryMenu } from "@/types/category";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

interface IMenu {}

const Menu = ({}: IMenu) => {
  /**
   * This component is highly inspired by the react mega menu by @james-priest
   * https://github.com/jasonrundell/react-mega-menu
   *
   * The main difference is that this component is built for dynamic data with quite a lot changes to the styles and structure.
   * Also it's all rewritten in typescript and somewhere uses mui components.
   */

  const router = useRouter();
  const [megaTMenuState, setMegaTMenuState] = useState<TMenuState>("");
  const [subTMenuState, setSubTMenuState] = useState<TMenuState>("");
  const [subSubTMenuState, setSubSubTMenuState] = useState<TMenuState>("");
  const [activeMenus, setActiveMenus] = useState<string[]>([]); // array that captures the ids of active menus
  const wrapperRef = useRef<HTMLDivElement>(null); // used to detect clicks outside of component

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const { data: categories, error: isError } = useSWR<ICategoryMenu[]>(
    "/api/category",
    (url: string) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    // Reset menu if route changes
    resetMenus();
    setMegaTMenuState("closed");
  }, [router.asPath]);

  const categoryGenerator = useCallback(
    (categories: ICategoryMenu[], level: number = 0) =>
      MenuGenerator(
        categories,
        level,
        activeMenus,
        toggleSubMenu,
        toggleSubSubMenu,
        a11yClick,
        isMobile
      ),
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

  const a11yClick = (e: KeyboardEvent | React.KeyboardEvent) => {
    const key = e.key || e.key;
    if (key === " " || key === "Enter") {
      return true;
    }
  };

  useOutsideAlerter(wrapperRef); // create bindings for closing menu from outside events

  return (
    <div role="navigation" className="rmm__root" ref={wrapperRef}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={{
          xs: 5,
          sm: 5,
        }}
      >
        <IconButton
          // onClick={onOpenMobileMenu}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            toggleMegaMenu(e, "menubar-main-categories")
          }
          sx={{
            color: "text.primary",
            display: { lg: "none" },
          }}
        >
          <MenuIcon />
        </IconButton>
        {/* <Hamburger
        label="Menu"
        state={megaTMenuState}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          toggleMegaMenu(e, "menubar-main-categories")
        }
      /> */}
        <Logo />
      </Stack>
      <Nav
        id="site-nav"
        activeState={megaTMenuState}
        ariaLabel="Main Navigation"
      >
        <MainList id="menubar-main-categories" ariaLabel="Main Menu Category">
          {categories && categories.length > 0
            ? categoryGenerator(categories, 0)
            : null}
        </MainList>
      </Nav>
    </div>
  );
};

export default Menu;
