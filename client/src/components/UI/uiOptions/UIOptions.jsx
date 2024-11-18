import "./UIOptions.css";
import useClickOnEverything from "hooks/useClickOnEverything";
import { forwardRef, useEffect, useRef, useState } from "react";

// const optionsContent = [
//   {
//     name: "Remove",
//     onClick: () => {...},
//     iconSrc: "..." || null,
//     svgIcon: "..." || null
//   }
// ];

// i'm lazy to find a workaround for use of jsdoc with forwardRef in my case
/**
  * btn that opens popup options
  * 
  * @component
  * @param {Object} props
  * @param {Object[]} props.optionsContent
  * @param {string} props.optionsContent.name - option btn name
  * @param {string} props.optionsContent.onClick - option btn click handler
  * @param {string | null} props.optionsContent.iconSrc - option btn's icon src
  * @param {string | null} props.optionsContent.svgIcon - option btn's icon svg element
  * @param {boolean} props.isToAlwaysRemainBtn - defines is the ui options btn always visible
  */
const UIOptions = forwardRef(({ optionsContent, isToAlwaysRemainBtn = false }, btnRef) => {
  const wrapperRef = useRef(null);
  const firstPopupBtnRef = useRef(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (isPopupVisible) firstPopupBtnRef.current?.focus();
  }, [isPopupVisible]);

  function onOptionsBtnClick() {
    if (isToAlwaysRemainBtn) {
      setIsPopupVisible(!isPopupVisible);
    } else {
      // doesn't really do anything but let it be
      if (!isPopupVisible) setIsPopupVisible(true);
    }
  }

  function onClose() {
    setIsPopupVisible(false);
  }

  useClickOnEverything(onClose, wrapperRef, null, true);

  let wrapperClassName = "ui-options-wrap";
  let btnClassName = "ui-options-btn ui-options-open-options-btn link-colors";

  if (isToAlwaysRemainBtn) {
    wrapperClassName += " always-with-visible-btn";
  } else {
    if (isPopupVisible) {
      btnClassName += " display-none";
    }
  }

  return (
    <div className={wrapperClassName} ref={wrapperRef}>
      {/* rendering the btn all time to not focus it once again after we left the options list with keyboard */}
      <button
        className={btnClassName}
        onClick={onOptionsBtnClick}
        aria-label="Open"
        aria-hidden={isToAlwaysRemainBtn ? false : isPopupVisible}
        disabled={isToAlwaysRemainBtn ? false : isPopupVisible}
        ref={btnRef}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343" role="img" aria-label="Options">
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </button>
      {isPopupVisible && (
        <>
          <ul className="ui-options-popup" aria-live="polite">
            {optionsContent.map((option, index) => {
              let propsWithPossibleRef = {};
              if (index === 0) propsWithPossibleRef.ref = firstPopupBtnRef;
    
              let imgElem;
              if (option.iconSrc) {
                imgElem = <img src={option.iconSrc} alt="" draggable="false" />;
              } else if (option.svgIcon) {
                imgElem = option.svgIcon;
              }
    
              function onClick() {
                option.onClick();
                onClose();
              }
    
              return (
                <li key={option.name}>
                  <button
                    className="ui-options-btn link-colors"
                    onClick={onClick}
                    {...propsWithPossibleRef}
                  >
                    {imgElem && imgElem}
                    {option.name}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="options-end" tabIndex={0} onFocus={onClose} />
        </>
      )}
    </div>
  );
});

export default UIOptions;
