/**
 * /components/Footer/FooterWrapper.tsx
 * This is the wrapper for the footer which renders both footer menu and line with terms of conditions, etc.
 */

import FooterLine from "./FooterLine";
import FooterMenu from "./FooterMenu";

const FooterWrapper = () => {
  return (
    <div>
      <FooterMenu />
      <FooterLine />
    </div>
  );
};

export default FooterWrapper;
