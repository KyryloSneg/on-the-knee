import "./UIButton.css";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const POSSIBLE_VARIANTS = ["primary1", "primary2", "primary3", "modal-submit", "modal-deny"];

const UIButton = forwardRef(({ variant = "primary1", children="Test children", isLink = false, to = "#", hasIcon = false, ...props }, ref) => {
  if (!POSSIBLE_VARIANTS.includes(variant)) throw Error("type of UIButton is incorrect");
  
  let className = `ui-button ${variant}`;
  if (hasIcon) {
    className += " has-icon";
  }

  if (props.className) {
    className += ` ${props.className}`;
  }

  if (props.className || props.className === "") {
    delete props.className;
  }

  if (isLink) {
    return (
      <Link to={to} className={className} {...props} ref={ref}>
        {children}
      </Link>
    );
  };

  return (
    <button type="button" className={className} {...props} ref={ref}>
      {children}
    </button>
  );
});

export default UIButton;
