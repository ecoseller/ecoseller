import React from 'react'
// Utils
import { classNames } from '../utils/css'

interface ITopBarTitleProps {
  id?: string
  className?: string
  children: React.ReactNode
}

const TopBarTitle = ({ id, className, children }: ITopBarTitleProps) => {
  const rootClasses = classNames('rmm__top-bar-title', className && className)

  return (
    <h1 id={id} className={rootClasses}>
      {children}
    </h1>
  )
}

export default TopBarTitle
