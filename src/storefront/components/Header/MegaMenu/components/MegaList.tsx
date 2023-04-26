import React from "react";
// Utils
import { classNames } from "../utils/css";
import { TMenuState } from "../utils/MenuStateMachine";

interface IMegaListProps {
  id: string;
  activeState: TMenuState;
  children: React.ReactNode;
}

const MegaList = ({ id, activeState = "", children }: IMegaListProps) => {
  const rootClasses = classNames(
    "rmm__mega-list",
    activeState && `rmm__mega-list--${activeState}`
  );

  const wrapperClasses = classNames("rmm__mega-list__wrapper");

  return (
    <ul role="menu" className={rootClasses} id={id} aria-labelledby={id}>
      {children}
    </ul>
  );
};

export default MegaList;
