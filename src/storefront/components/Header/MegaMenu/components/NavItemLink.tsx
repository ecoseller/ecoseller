import React, { MouseEvent, KeyboardEvent } from "react";
// Utils
import { classNames } from "../utils/css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
interface INavItemLinkProps {
  id: string;
  role?: string;
  href: string;
  isBack?: boolean;
  isHeading?: boolean;
  isForward?: boolean;
  isActive?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLAnchorElement>) => void;
  ariaHaspopup?:
    | boolean
    | "dialog"
    | "menu"
    | "grid"
    | "listbox"
    | "tree"
    | "true"
    | "false"
    | false
    | true
    | undefined;
  ariaControls?: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const NavItemLink = ({
  id,
  role = "menuitem",
  href,
  isBack = false,
  isHeading = false,
  isForward = false,
  isActive = false,
  className,
  onClick,
  onKeyDown,
  ariaHaspopup,
  ariaControls,
  children,
  isMobile,
}: INavItemLinkProps) => {
  const rootClasses = classNames(
    "rmm__nav-item-link",
    isBack && "rmm__nav-item-link--back",
    isHeading && "rmm__nav-item-link--heading",
    isForward && "rmm__nav-item-link--forward",
    isActive && "rmm__nav-item-link--active",
    className && className
  );
  const showAllClasses = classNames(
    "rmm__nav-item-link--show-all",
    className && className
  );

  return (
    <>
      <Link
        id={id}
        role={role}
        href={href}
        className={rootClasses}
        onClick={!isMobile ? undefined : onClick}
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
          {isMobile && isBack ? <ArrowBackIosIcon fontSize="small" /> : null}
          {children}
          {isMobile && isForward ? <NavigateNextIcon fontSize="small" /> : null}
        </div>
      </Link>
      {isMobile && isBack ? (
        <Link
          id={id}
          role={role}
          href={href}
          className={showAllClasses}
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
            Show all
          </div>
        </Link>
      ) : null}
    </>
  );
};

export default NavItemLink;
