import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface INavItemDescriptionProps {
  className?: string
  children: React.ReactNode
}

const NavItemDescription = ({
  className,
  children,
}: INavItemDescriptionProps) => {
  const rootClasses = classNames(
    'rmm__nav-item-description',
    className && className
  )
  return <p className={rootClasses}>{children}</p>
}

export default NavItemDescription
