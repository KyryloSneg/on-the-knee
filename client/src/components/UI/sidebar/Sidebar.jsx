import { useContext, useEffect, useRef } from "react";
import useClickOnTheDarkBg from "../../../hooks/useClickOnTheDarkBg";
import { Context } from "../../../Context";
import "./Sidebar.css";
// import { animate } from "../../../utils/animation";

const Sidebar = ({ children, closeSidebar, headerText = "", className = "" }) => {
  const { app } = useContext(Context);
  const sidebarRef = useRef(null);

  let sectionClassName = "sidebar closer-than-darkbg";
  if (className) {
    sectionClassName = ` ${className}`
  }

  useEffect(() => {
    // animate({
    //   timing: ease
    // })
  }, []);

  function onClickOnTheDarkBg() {
    // sidebarRef.current.className += " animation-right-to-left";

    // 800 ms - time for the end of the animation
    setTimeout(() => {
      closeSidebar();
      // sidebarRef.current.className = sectionClassName; 
    }, 800);
  }

  useClickOnTheDarkBg(onClickOnTheDarkBg, app.darkBgVisible);

  return (
    <section className={sectionClassName} ref={sidebarRef}>
      <header>
        <button 
          onClick={closeSidebar} 
          className="close-sidebar-btn" 
          aria-label="close sidebar"
        >
          {/* using svg element to change its fill color */}
          <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
            <path d="m330-444 201 201-51 51-288-288 288-288 51 51-201 201h438v72H330Z"/>
          </svg>
          {/* <img src={backArrowIcon} alt="" /> */}
          <h2>{headerText}</h2>
        </button>
      </header>
        
      {children}
    </section>
  );
}

export default Sidebar;
