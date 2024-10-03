import "./MenuIconBtn.css";
import { Link } from "react-router-dom";
import { forwardRef } from "react";

const MenuIconBtn = forwardRef(({ children = "Test", src, alt = "", isLink = false, route = null, ...params }, ref) => {
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
        {typeof children === "string"
          ? <span>{children}</span>
          : children
        }
      </Link>
    );
  }

  return (
    <button className={className} ref={ref} {...params} >
      <img src={src} alt={alt} className="no-select" draggable="false"/>
      {typeof children === "string"
        ? <span>{children}</span>
        : children
      }
    </button>
  );
});

export default MenuIconBtn;
