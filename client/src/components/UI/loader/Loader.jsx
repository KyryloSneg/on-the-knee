import { Spinner } from "react-bootstrap";
import "./Loader.css";

const Loader = ({ className, ...props }) => {
  let spinnerClassName = "no-select";
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
