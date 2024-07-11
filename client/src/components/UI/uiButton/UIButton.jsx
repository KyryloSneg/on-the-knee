import "./UIButton.css";

const POSSIBLE_VARIANTS = ["primary1", "primary2", "primary3", "modal-submit", "modal-deny"];

const UIButton = ({ variant = "primary1", children="Test children", ...props }) => {
  if (!POSSIBLE_VARIANTS.includes(variant)) throw Error("type of UIButton is incorrect");
  
  let className = `ui-button ${variant}`;
  if (props.className) {
    className += ` ${props.className}`;
    delete props.className;
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export default UIButton;
