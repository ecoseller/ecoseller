import React from 'react'
interface IMainList {
  id: string
  ariaLabel?: string
  children: React.ReactNode
}

const MainList = ({ id, children, ariaLabel = 'Main menu' }: IMainList) => {
  return (
    <ul
      id={id}
      role="menubar"
      aria-label={ariaLabel}
      className="rmm__main-list"
    >
      {children}
    </ul>
  )
}

export default MainList
