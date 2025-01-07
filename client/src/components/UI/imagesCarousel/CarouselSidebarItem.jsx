import "./CarouselSidebarItem.css"

const CarouselSidebarItem = ({ image, id, selectedId, setSelectedId, tabIdWithoutIndex, tabpanelIdWithoutIndex }) => {
  const isActive = id === selectedId;

  let className = "carousel-sidebar-item";
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
      aria-label="Zoom in this image"
      aria-selected={isActive}
      aria-controls={`${tabpanelIdWithoutIndex}-${id}`}
    >
      <img src={image.src} alt={image.alt} draggable="false" />
    </button>
  );
}

export default CarouselSidebarItem;
