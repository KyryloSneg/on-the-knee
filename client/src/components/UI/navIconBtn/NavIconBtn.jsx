import "./NavIconBtn.css";
import { Link } from "react-router-dom";
import { forwardRef } from "react";

const NavIconBtn = forwardRef(({ src, alt = "", text = "", isLink = false, route = null, ...params }, ref) => {
  let className = "nav-icon-button";
  if (text) {
    className += " nav-icon-button-text";
  }
  // i guess it's better idea to ADD new styles from params not OVERRIDE old ones
  if (params.className) {
    className += ` ${params.className}`;
    delete params.className;
  }

  if (isLink) {
    return (
      <Link to={route} className={className} {...params} ref={ref}>
        {text && <span>{text}</span>}
        <img src={src} alt={alt} draggable="false"/>
      </Link>
    );
  }

  return (
    <button className={className} ref={ref} {...params} >
      {text && <span>{text}</span>}
      <img src={src} alt={alt} draggable="false"/>
    </button>
  );
});

export default NavIconBtn;
