import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface INavItemProps {
  id: string
  role?: string
  isHeading?: boolean
  isForward?: boolean
  className?: string
  children: React.ReactNode
}

const NavItem = ({
  id,
  role = 'none',
  isHeading = false,
  isForward = false,
  className,
  children,
}: INavItemProps) => {
  const rootClasses = classNames(
    'rmm__nav-item',
    isHeading && 'rmm__nav-item--heading',
    isForward && 'rmm__nav-item--forward',
    className && className
  )
  return (
    <li id={id} role={role} className={rootClasses}>
      {children}
    </li>
  )
}

export default NavItem
