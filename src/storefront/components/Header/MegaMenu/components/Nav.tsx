import React from 'react'
// Utils
import { classNames } from '../utils/css'
import { TMenuState } from '../utils/MenuStateMachine'

interface INavProps {
  id: string
  ariaLabel: string
  activeState: TMenuState
  children: React.ReactNode
}

const Nav = ({
  id,
  ariaLabel = 'Main Navigation',
  activeState = '',
  children,
}: INavProps) => {
  const rootClasses = classNames(
    'rmm__nav',
    activeState && `rmm__nav--${activeState}`
  )

  return (
    <nav id={id} className={rootClasses} aria-label={ariaLabel}>
      {children}
    </nav>
  )
}

export default Nav
