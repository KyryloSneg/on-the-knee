import "./CarouselBottomSelectBarItem.css";

const CarouselBottomSelectBarItem = ({ id, selectedId, setSelectedId, tabIdWithoutIndex, tabpanelIdWithoutIndex }) => {
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
      role="tab"
      className={className} 
      id={`${tabIdWithoutIndex}-${id}`}
      onClick={onClick} 
      aria-label={`Zoom in the device's image number ${id + 1}`}
      aria-selected={isActive}
      aria-controls={`${tabpanelIdWithoutIndex}-${id}`}
    />
  );
}

export default CarouselBottomSelectBarItem;
