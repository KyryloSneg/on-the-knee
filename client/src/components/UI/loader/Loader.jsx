import "./Loader.css";
import { Spinner } from "react-bootstrap";

const Loader = ({ className, ...props }) => {
  let spinnerClassName = "custom-loader no-select";
  if (className) {
    spinnerClassName += ` ${className}`;
  }

  return (
    <Spinner
      animation="border"
      variant="primary"
      size="sm"
      role="status"
      className={spinnerClassName}
      {...props}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default Loader;
