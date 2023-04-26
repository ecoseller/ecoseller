import React, { MouseEvent, KeyboardEvent } from 'react'
// Utils
import { classNames } from '../utils/css'

interface INavItemLinkProps {
  id: string
  role?: string
  href: string
  isBack?: boolean
  isHeading?: boolean
  isForward?: boolean
  isActive?: boolean
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLAnchorElement>) => void
  ariaHaspopup?:
    | boolean
    | 'dialog'
    | 'menu'
    | 'grid'
    | 'listbox'
    | 'tree'
    | 'true'
    | 'false'
    | false
    | true
    | undefined
  ariaControls?: string
  children: React.ReactNode
}

const NavItemLink = ({
  id,
  role = 'menuitem',
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
}: INavItemLinkProps) => {
  const rootClasses = classNames(
    'rmm__nav-item-link',
    isBack && 'rmm__nav-item-link--back',
    isHeading && 'rmm__nav-item-link--heading',
    isForward && 'rmm__nav-item-link--forward',
    isActive && 'rmm__nav-item-link--active',
    className && className
  )
  return (
    <a
      id={id}
      role={role}
      href={href}
      className={rootClasses}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      {children}
    </a>
  )
}

export default NavItemLink
