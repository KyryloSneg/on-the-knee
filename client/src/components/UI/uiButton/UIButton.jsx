import "./UIButton.css";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

const POSSIBLE_VARIANTS = ["primary1", "primary2", "primary3", "secondary1", "modal-submit", "modal-deny"];

const UIButton = forwardRef(({ 
  variant = "primary1", children="Test children", isLink = false, to = "#", hasIcon = false, isLoading = false, ...props 
}, ref) => {
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

  const childrenContent = (
    isLoading
      ? <Loader />
      : children
  );

  if (isLink) {
    return (
      <Link to={to} className={className} {...props} ref={ref}>
        {childrenContent}
      </Link>
    );
  };

  const isDisabled = props.disabled || isLoading;
  return (
    <button type="button" className={className} {...props} disabled={isDisabled} ref={ref}>
      {childrenContent}
    </button>
  );
});

export default UIButton;
