import { Link } from "react-router-dom";
import "./MenuIconBtn.css";
import { forwardRef } from "react";

const MenuIconBtn = forwardRef(({ text, src, alt = "", isLink = false, route = null, ...params }, ref) => {
  let className = "menu-icon-button";

  // i guess it's better idea to ADD new styles from params not OVERRIDE old ones
  if (params.className) {
    className += ` ${params.className}`;
    delete params.className;
  }

  if (isLink) {
    return (
      <Link to={route} className={className} {...params} ref={ref}>
        <img src={src} alt={alt} className="no-select" draggable="false"/>
        {text && <span>{text}</span>}
      </Link>
    );
  }

  return (
    <button className={className} ref={ref} {...params} >
      <img src={src} alt={alt} className="no-select" draggable="false"/>
      {text && <span>{text}</span>}
    </button>
  );
});

export default MenuIconBtn;
