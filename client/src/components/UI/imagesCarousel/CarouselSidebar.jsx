import "./CarouselSidebar.css";
import { forwardRef } from "react";
import CarouselSidebarItem from "./CarouselSidebarItem";

const CarouselSidebar = forwardRef(({ images, selectedId, setSelectedId }, ref) => {
  return (
    <nav className="carousel-sidebar" ref={ref}>
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
});

export default CarouselSidebar;
