import { useContext, useEffect, useRef } from "react";
import "./ModalWindow.css";
import { Context } from "../../../Context";
import useFocusTraps from "../../../hooks/useFocusTraps";
import useClickOnTheDarkBg from "../../../hooks/useClickOnTheDarkBg";
import { observer } from "mobx-react-lite";
import useWindowInvisibleFocus from "../../../hooks/useWindowInvisibleFocus";

const ModalWindow = observer(({ isVisible, setIsVisible, children, headerText, id }) => {
  const { app } = useContext(Context)

  const modalRef = useRef(null);
  const closeModalBtnRef = useRef(null);

  const firstFocusTrapRef = useRef(null);
  const lastFocusTrapRef = useRef(null);

  function closeModalWindow() {
    if (!isVisible) return;
    setIsVisible(false);
  }

  let className = "modal-window closer-than-darkbg";
  if (!isVisible) {
    className += " not-visible-modal";
  } else {
    className +=" window";
  }

  const headingId = `${id}-heading`;

  useEffect(() => {
    app.setModalVisible(isVisible);
  }, [app, isVisible]);

  useWindowInvisibleFocus(closeModalBtnRef, isVisible);
  useFocusTraps(firstFocusTrapRef, lastFocusTrapRef, modalRef);
  useClickOnTheDarkBg(closeModalWindow, app.darkBgVisible);

  return (
    <section 
      className={className} 
      id={id} 
      role="dialog"
      aria-labelledby={headingId}
      ref={modalRef}>
      <div className="visually-hidden" tabIndex={0} ref={firstFocusTrapRef} />
      <header>
        <h2 id={headingId}>{headerText}</h2>
        <button
          onClick={closeModalWindow}
          className="close-modal-btn"
          aria-label="Close modal window"
          ref={closeModalBtnRef}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </button>
      </header>
      {children}
      <div className="visually-hidden" tabIndex={0} ref={lastFocusTrapRef} />
    </section>
  );
});

export default ModalWindow;