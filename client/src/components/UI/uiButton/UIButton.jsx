import "./UIButton.css";
import { Link } from "react-router-dom";

const POSSIBLE_VARIANTS = ["primary1", "primary2", "primary3", "modal-submit", "modal-deny"];

const UIButton = ({ variant = "primary1", children="Test children", isLink = false, to = "#", ...props }) => {
  if (!POSSIBLE_VARIANTS.includes(variant)) throw Error("type of UIButton is incorrect");
  
  let className = `ui-button ${variant}`;
  if (props.className) {
    className += ` ${props.className}`;
  }

  if (props.className || props.className === "") {
    delete props.className;
  }

  if (isLink) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    );
  };

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export default UIButton;
