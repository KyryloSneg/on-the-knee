import Navbar from "./components/Navbar";
import "./App.css";
import MyFooter from "./components/MyFooter";
import { useContext, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "./Context";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  const { app } = useContext(Context);
  // ref for the "skip to next page content" btn
  const pageRef = useRef(null);
  const headerRef = useRef(null);  
  const context = { pageRef };

  useEffect(() => {
    app.setHeaderRef(headerRef);
  }, [headerRef]);

  useEffect(() => {
    if (app.isBlockedScroll) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    }
  }, [app.isBlockedScroll])

  return (
    <div>
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
      {app.darkBgVisible && <div id="app-dark-bg" tabIndex={0} data-testid="app-dark-bg" />}
      <header ref={headerRef}>
        <Navbar toFocusRef={pageRef} />
      </header>
      <Outlet context={context} />
      <MyFooter />
    </div>  
  );
});

export default App;
