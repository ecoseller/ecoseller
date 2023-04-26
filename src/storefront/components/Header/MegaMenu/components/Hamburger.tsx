import React, { MouseEvent } from 'react'
import { TMenuState } from '../utils/MenuStateMachine'
interface IHamburgerProps {
  label?: string
  state: TMenuState
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const Hamburger = ({ label, state, onClick }: IHamburgerProps) => {
  let innerState: string = state
  if (innerState === '') {
    innerState = 'rmm__hamburger--closed'
  } else if (innerState === 'open') {
    innerState = 'rmm__hamburger--open'
  }
  return (
    <button className={`rmm__hamburger ${innerState}`} onClick={onClick}>
      <div className="rmm_hamburger--slice-container">
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
        <span className="rmm_hamburger--slice"></span>
      </div>
      {label && (
        <div className="rmm_hamburger--label-container">
          <span className="rmm_hamburger--label">{label}</span>
        </div>
      )}
    </button>
  )
}

export default Hamburger
