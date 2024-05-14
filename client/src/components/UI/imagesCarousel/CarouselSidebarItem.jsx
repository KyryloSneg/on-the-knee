import "./CarouselSidebarItem.css"

const CarouselSidebarItem = ({ image, id, selectedId, setSelectedId }) => {
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
      className={className} 
      onClick={onClick} 
      aria-label="Zoom in this image"
    >
      <img src={image.src} alt={image.alt} draggable="false" />
    </button>
  );
}

export default CarouselSidebarItem;
