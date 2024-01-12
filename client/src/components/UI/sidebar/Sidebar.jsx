import { useContext, useRef } from "react";
import useClickOnTheDarkBg from "../../../hooks/useClickOnTheDarkBg";
import { Context } from "../../../Context";
import "./Sidebar.css";
import { animate, easeIn } from "../../../utils/animation";
import useSidebarOpening from "../../../hooks/useSidebarOpening";
import { addListenerOnCloseAnimationEnd, addListenerOnCloseFrameEnd } from "../../../utils/addSidebarEventListeners";
import getTimeForLeftInterruptedAnim from "../../../utils/getTimeForLeftInterruptedAnim";
import useFocusTraps from "../../../hooks/useFocusTraps";
import useWindowInvisibleFocus from "../../../hooks/useWindowInvisibleFocus";

const Sidebar = ({ children, closeSidebar, shortcutRef, headerText = "", className = "", id = "" }) => {
  const { app } = useContext(Context);

  const sidebarRef = useRef(null);
  const closeSidebarBtnRef = useRef(null);

  const firstFocusTrapRef = useRef(null);
  const lastFocusTrapRef = useRef(null);

  const isEndedOpeningAnim = useRef(false);
  const isRunningClosingAnim = useRef(false);

  let sectionClassName = "sidebar closer-than-darkbg use-preety-scrollbar";
  if (className) {
    sectionClassName = ` ${className}`
  }

  useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, sidebarRef);
  // using "invisible" focus to not annoy users that using pointer click 
  useWindowInvisibleFocus(closeSidebarBtnRef);

  // caution: do not change the code below for the God's sake
  const animationsDuration = 800;
  useSidebarOpening(sidebarRef, animationsDuration, isEndedOpeningAnim);

  function onClosingSidebar() {
    if (isRunningClosingAnim.current) return;

    // 800 ms - time for the end of the animation
    function animateClosing(timeForLeftInterruptedAnim = 0) {
      animate({
        timing: easeIn,
        draw: draw,
        duration: animationsDuration,
        elem: sidebarRef.current,
        uniqueEventId: "closing",
        timeForLeftInterruptedOppositeAnim: timeForLeftInterruptedAnim,
      });
    }

    function draw(progress) {
      // 0% => -100%
      if (!sidebarRef.current) return;
      sidebarRef.current.style.left = (-progress * 100) + "%";
    }

    function onOpeningAnimFrameEnd(event, isEndedAnim = false) {
      let timeForLeftInterruptedAnim = 0;
      if (!isEndedAnim) {
        function endOpeningAnimation() {
          cancelAnimationFrame(event.detail.outerRequestId);
          cancelAnimationFrame(event.detail.innerRequestId);
        }

        endOpeningAnimation();
        timeForLeftInterruptedAnim = getTimeForLeftInterruptedAnim(isEndedAnim, animationsDuration, event.detail.currentTime);
      }

      function closeSidebarAndFocusShortcut() {
        closeSidebar();
        shortcutRef?.current?.focus();
      }

      animateClosing(timeForLeftInterruptedAnim);
      addListenerOnCloseFrameEnd(sidebarRef.current, isRunningClosingAnim);
      addListenerOnCloseAnimationEnd(sidebarRef.current, closeSidebarAndFocusShortcut, isRunningClosingAnim);

      if (!isEndedAnim) sidebarRef.current.removeEventListener("jsFrameEnd-opening", onOpeningAnimFrameEnd);
    }

    if (isEndedOpeningAnim.current) {
      onOpeningAnimFrameEnd(null, true);
    } else {
      sidebarRef.current.addEventListener("jsFrameEnd-opening", onOpeningAnimFrameEnd);
    }

  }

  useClickOnTheDarkBg(onClosingSidebar, app.darkBgVisible);
  return (
    <section className={sectionClassName} id={id} ref={sidebarRef}>
      <header>
        <div className="visually-hidden" tabIndex={0} ref={firstFocusTrapRef} />
        <button
          onClick={onClosingSidebar}
          className="close-sidebar-btn"
          aria-label="close sidebar"
          ref={closeSidebarBtnRef}
        >
          {/* using svg element to change its fill color */}
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
          </svg>
          {/* <img src={backArrowIcon} alt="" /> */}
          <h2>{headerText}</h2>
        </button>
      </header>
      {children}
      <div className="visually-hidden" tabIndex={0} ref={lastFocusTrapRef} />
    </section>
  );
}

export default Sidebar;
