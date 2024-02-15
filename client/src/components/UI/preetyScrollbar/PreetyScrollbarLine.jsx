import "./PreetyScrollbarLine.css";

const PreetyScrollbarLine = ({ offset }) => {
  return (
    <div className="preety-scrollbar-line" aria-hidden="true">
      <div className="preety-scrollbar-thumb" />
    </div>
  );
}

export default PreetyScrollbarLine;
