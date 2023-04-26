import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface IMainNavItemProps {
  id: string
  role?: string
  isHeading?: boolean
  isChildren?: boolean
  isForward?: boolean
  className?: string
  children: React.ReactNode
}

const MainNavItem = ({
  id,
  role = 'none',
  isHeading = false,
  isChildren = false,
  isForward = false,
  className,
  children,
}: IMainNavItemProps) => {
  const rootClasses = classNames(
    'rmm__main-nav-item',
    isHeading && 'rmm__main-nav-item--heading',
    isChildren && 'rmm__main-nav-item--children',
    isForward && 'rmm__main-nav-item--forward',
    className && className
  )
  return (
    <li id={id} role={role} className={rootClasses}>
      {children}
    </li>
  )
}

export default MainNavItem
