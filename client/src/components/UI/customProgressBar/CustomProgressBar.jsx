import "./CustomProgressBar.css";

const CustomProgressBar = ({ progress = 100, propsClassName = "" }) => {
  const progressToRender = progress > 100 ? 100 : progress;

  let className = "custom-progress-bar-container";
  if (propsClassName) {
    className += propsClassName;
  }
  
  return (
    <div className={className}>
      <div 
        className="custom-progress-bar" 
        style={{ width: `${progressToRender}%` }} 
      >
        <progress value={progressToRender} max={100} className="visually-hidden" />
      </div>
    </div>
  );
}

export default CustomProgressBar;
