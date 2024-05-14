import "./CarouselSidebar.css";
import CarouselSidebarItem from "./CarouselSidebarItem";

const CarouselSidebar = ({ images, selectedId, setSelectedId }) => {
  return (
    <nav className="carousel-sidebar">
      <ul>
        {images.map((image, index) => 
          <li key={index}>
            <CarouselSidebarItem
              image={image} 
              id={index} 
              selectedId={selectedId}
              setSelectedId={setSelectedId} 
            />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default CarouselSidebar;
