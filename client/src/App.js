import "./App.css";
import "react-international-phone/style.css";
import Navbar from "./components/Navbar";
import MyFooter from "./components/MyFooter";
import { useContext, useEffect, useRef } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Context } from "./Context";
import { observer } from "mobx-react-lite";
import getAllFocusableElements from "./utils/getAllFocusableElements";
import useWindowWidth from "./hooks/useWindowWidth";
import useBlockingScroll from "./hooks/useBlockingScroll";
import CategoriesMenu from "./components/CategoriesMenu";
import useInitialDataFetching from "./hooks/useInitialDataFetching";
import useClosingAllWindows from "./hooks/useClosingAllWindows";
import useDeliveriesFetching from "./hooks/useDeliveriesFetching";
import useGettingCartData from "hooks/useGettingCartData";
import HeaderSendActivationEmail from "components/HeaderSendActivationEmail";
import AppTopLevelModalsAndSidebars from "components/AppTopLevelModalsAndSidebars";
 
const App = observer(() => {
  const { app, deviceStore, user } = useContext(Context);
  // ref for the "skip to next page content" btn
  const headerRef = useRef(null);
  const pageRef = useRef(null);
  const location = useLocation();
  const navCategoryBtnRef = useRef(null);
  const windowWidth = useWindowWidth();

  let pageElemToFocus;
  if (app.pageRef?.current) {
    pageElemToFocus = getAllFocusableElements(app.pageRef.current)[0];
  }

  // adding windowWidth to the dependencies because there could be some differences in desktop and mobile versions
  useEffect(() => {
    app.setPageRef(pageRef);
  }, [app, location.pathname, windowWidth]);

  useEffect(() => {
    app.setHeaderRef(headerRef);
  }, [app, headerRef]);

  useInitialDataFetching();
  useDeliveriesFetching();
  // fixes a bug on the checkout page that resets all selected add. services
  useGettingCartData(user.cart?.id, null, true);
  useClosingAllWindows();

  useBlockingScroll(app.isBlockedScroll);

  return (
    <div>
      <ScrollRestoration />
      {/* our gray bg on global loading */}
      {app.isGlobalLoading &&
        <div id="app-global-loading-bg" />
      }
      {/* our global loading loader bar */}
      {app.isGlobalLoading &&
        <div className="app-global-loading-bar">
          {/* rectangle that moves along the bar */}
          <div className="app-global-loading-bar-rect" />
          <span className="visually-hidden">Loading...</span>
        </div>
      }
      {/* dark bg that shows up on certain events (like opening a modal window) */}
      {app.darkBgVisible && (
        <div 
          id="app-dark-bg" 
          className={app.isVisibleErrorModal ? 
            "error-modal-shown visible" : "visible"
          } 
          tabIndex={0} 
          data-testid="app-dark-bg" 
        /> 
      )}
      <AppTopLevelModalsAndSidebars />
      <header ref={headerRef}>
        {user.isAuth && !user.isEmailActivated && <HeaderSendActivationEmail />}
        <Navbar elemToFocus={pageElemToFocus} navCategoryBtnRef={navCategoryBtnRef} />
        {(app.isVisibleCategoriesMenu && !!Object.keys(deviceStore.categories).length) && 
          <CategoriesMenu navCategoryBtnRef={navCategoryBtnRef} />
        }
      </header>
      <div ref={pageRef}>
        <Outlet />
      </div>
      <MyFooter />
    </div>
  );
});

export default App;
