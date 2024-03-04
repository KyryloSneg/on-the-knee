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
import { observer } from "mobx-react-lite";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";

const Sidebar = observer(({ children, closeSidebar, shortcutRef, id, headerText = "", className = "" }) => {
  const { app } = useContext(Context);

  const sidebarRef = useRef(null);
  const closeSidebarBtnRef = useRef(null);

  const firstFocusTrapRef = useRef(null);
  const lastFocusTrapRef = useRef(null);

  const isEndedOpeningAnim = useRef(false);
  const isRunningClosingAnim = useRef(false);

  const headingId = `${id}-heading`;
  let placeholderClassName = "sidebar-placeholder"
  let sectionClassName = "sidebar window";

  // in every single case if modal window is opened, previously opened sidebar becomes behind dark bg
  if (!app.modalVisible) {
    placeholderClassName += " closer-than-darkbg";
    sectionClassName += " closer-than-darkbg";
  }

  if (className) {
    sectionClassName = ` ${className}`
  }

  useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, sidebarRef);
  // using "invisible" focus to not annoy users that using pointer click 
  useWindowInvisibleFocus(closeSidebarBtnRef);

  // caution: do not change the code below for the God's sake
  const animationsDuration = 550;
  useSidebarOpening(sidebarRef, animationsDuration, isEndedOpeningAnim);

  function onClosingSidebar() {
    if (isRunningClosingAnim.current) return;

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

  function onClickOnTheDarkBg() {
    if (app.modalVisible) return;
    onClosingSidebar();
  }

  useClickOnTheDarkBg(onClickOnTheDarkBg, app.darkBgVisible);

  // if user clicked on the area of future sidebar while it's opening, do not close it 
  // (so we need sidebar placeholder for such behaviour)
  return [
    <div className={placeholderClassName} aria-hidden="true" key="sidebar-placeholder" />,
    <section
      className={sectionClassName}
      id={id}
      role="dialog"
      aria-labelledby={headingId}
      ref={sidebarRef}
      key="sidebar"
    >
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
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
          <h2 id={headingId}>{headerText}</h2>
        </button>
      </header>
      <div className="sidebar-child-positioning">
        <CustomScrollbar children={children} isRect={true}/>
      </div>
      <div className="visually-hidden" tabIndex={0} ref={lastFocusTrapRef} />
    </section>
  ];
});

export default Sidebar;
