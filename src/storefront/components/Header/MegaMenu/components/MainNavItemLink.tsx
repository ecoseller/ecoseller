import React from "react";
// Utils
import { classNames } from "../utils/css";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
interface IMainNavItemLink {
  id: string;
  role?: string;
  href: string;
  isBack?: boolean;
  isForward?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  ariaHaspopup?:
    | boolean
    | "dialog"
    | "menu"
    | "grid"
    | "listbox"
    | "tree"
    | "false"
    | "true";
  ariaControls?: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const MainNavItemLink = ({
  id,
  role,
  href,
  isBack,
  isForward,
  isActive,
  className,
  onMouseEnter,
  onClick,
  onKeyDown,
  ariaHaspopup,
  ariaControls,
  children,
  isMobile,
}: IMainNavItemLink) => {
  const rootClasses = classNames(
    "rmm__main-nav-item-link",
    isBack && "rmm__main-nav-item-link--back",
    isForward && "rmm__main-nav-item-link--forward",
    isActive && "rmm__main-nav-item-link--active",
    className && className
  );
  console.log(
    "MainNavItemLink",
    id,
    role,
    href,
    isBack,
    isForward,
    isActive,
    className,
    onMouseEnter,
    onClick,
    onKeyDown,
    ariaHaspopup,
    ariaControls,
    children,
    isMobile
  );
  return (
    <Link
      id={id}
      role={role}
      href={href}
      className={rootClasses}
      onClick={!isMobile ? undefined : onClick}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onKeyDown={onKeyDown}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {children}
        {isMobile && isForward ? (
          <NavigateNextIcon fontSize="small" />
        ) : isActive ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </div>
    </Link>
  );
};

export default MainNavItemLink;
