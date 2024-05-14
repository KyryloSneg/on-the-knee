import "./CarouselBottomSelectBarItem.css";

const CarouselBottomSelectBarItem = ({ id, selectedId, setSelectedId }) => {
  const isActive = id === selectedId;

  let className = "carousel-bottom-select-bar-item";
  if (isActive) {
    className += " active";
  }

  function onClick() {
    if (selectedId !== id) setSelectedId(id);
  }

  return (
    <button 
      className={className} 
      onClick={onClick} 
      aria-label={`Zoom in the device's image number ${id + 1}`}
    />
  );
}

export default CarouselBottomSelectBarItem;
