import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";

const throwFakeErrorToFoolNextRouter = () => {
  // Throwing an actual error class trips the Next.JS 500 Page, this string literal does not.
  // eslint-disable-next-line no-throw-literal
  throw " Abort route change due to unsaved changes in form. Triggered by useOnLeavePageConfirmation. Please ignore this error.";
};

interface IuseOnLeavePageConfirmationProps {
  preventNavigation: boolean;
  onNavigate: (url: string) => void;
}

// https://github.com/vercel/next.js/discussions/32231?sort=new?sort=new
const useOnLeavePageConfirmation = ({
  preventNavigation,
  onNavigate,
}: IuseOnLeavePageConfirmationProps) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const nextPath = useRef("");

  const killRouterEvent = useCallback(() => {
    // router.events.emit("routeChangeError");
    router.events.emit("routeChangeError", "", "", { shallow: false });
    throwFakeErrorToFoolNextRouter();
  }, [router]);

  useEffect(() => {
    const onRouteChange = (url: string) => {
      if (preventNavigation && url !== currentPath) {
        nextPath.current = url;
        onNavigate(url);
        killRouterEvent();
      }
    };

    router.events.on("routeChangeStart", onRouteChange);

    return () => {
      router.events.off("routeChangeStart", onRouteChange);
    };
  }, [
    currentPath,
    killRouterEvent,
    onNavigate,
    router.events,
    preventNavigation,
  ]);

  const navigate = () => {
    router.push(nextPath.current);
  };

  return navigate;
};

export { useOnLeavePageConfirmation };
