import "./CustomScrollbar.css";
import { useRef } from "react";
import useScrollbars from "../../../hooks/useScrollbars";

const CustomScrollbar = ({ children, isRect = false, className = "" }) => {
  const scrollbarRef = useRef(null);

  let scrollClassName = "custom-scrollbar-div";
  if (className) {
    scrollClassName += ` ${className}`;
  }

  if (isRect) {
    scrollClassName += " rect";
  }

  useScrollbars(scrollbarRef);
  return (
    <div className={scrollClassName} ref={scrollbarRef}>
      {children}
    </div>
  );
}

export default CustomScrollbar;
