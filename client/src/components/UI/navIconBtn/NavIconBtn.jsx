import { Link } from "react-router-dom";
import "./NavIconBtn.css";

const NavIconBtn = ({ src, alt = "", text = "", isLink = false, route = null, ...params }) => {
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
      <Link to={route} className={className} {...params}>
        {text && <span>{text}</span>}
        <img src={src} alt={alt} className="no-select" draggable="false"/>
      </Link>
    );
  }

  return (
    <button className={className} {...params}>
      {text && <span>{text}</span>}
      <img src={src} alt={alt} className="no-select" draggable="false"/>
    </button>
  );
}

export default NavIconBtn;
