import "./styles/ScrollToTopBtn.css";
import UIButton from "./UI/uiButton/UIButton";
import topArrowIcon from "../assets/expand_less_24x24_white.svg";
import useWindowScrollTop from "hooks/useWindowScrollTop";
import { useState } from "react";

const ScrollToTopBtn = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { windowScrollTop, prevWindowScrollTopRef } = useWindowScrollTop();
  
  const isToRenderScrollToTopBtn = (
    windowScrollTop > document.documentElement.clientHeight * 1.5
    && windowScrollTop < prevWindowScrollTopRef.current
  );
  
  if (!isToRenderScrollToTopBtn) return;

  function onClick() {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
  }

  let className = "scroll-to-top-btn";
  if (isImageLoaded) {
    className += " with-loaded-image";
  }

  return (
    <UIButton className={className} onClick={onClick}>
      <img 
        src={topArrowIcon} 
        alt="Scroll to the top" 
        onLoad={() => setIsImageLoaded(true)} 
      />
    </UIButton>
  );
}

export default ScrollToTopBtn;
