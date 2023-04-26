import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface ITopBarProps {
  id?: string
  className?: string
  children: React.ReactNode
}

const TopBar = ({ id = 'top', className, children }: ITopBarProps) => {
  const rootClasses = classNames('rmm__top-bar', className && className)

  return (
    <div id={id} className={rootClasses}>
      {children}
    </div>
  )
}

export default TopBar
