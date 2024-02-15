import PreetyScrollbarLine from "./PreetyScrollbarLine";
import "./PreetyScrollbar.css";

const PreetyScrollbar = ({ children, className = "" }) => {
  let wrapperClassName = "preety-scrollbar-wrap";
  
  if (className) {
    wrapperClassName += ` ${className}`;
  }

  return (
    <div className={wrapperClassName}>
      {children}
      {true && <PreetyScrollbarLine offset={0} />}
    </div>
  );
}

export default PreetyScrollbar;
