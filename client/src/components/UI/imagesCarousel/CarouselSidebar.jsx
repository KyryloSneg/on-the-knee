import "./CarouselSidebar.css";
import { forwardRef } from "react";
import CarouselSidebarItem from "./CarouselSidebarItem";

const CarouselSidebar = forwardRef(({ images, selectedId, setSelectedId, tabIdWithoutIndex, tabpanelIdWithoutIndex }, ref) => {
  return (
    <div className="carousel-sidebar" role="tablist" ref={ref}>
      {images.map((image, index) =>
        <CarouselSidebarItem
          key={index}
          image={image}
          id={index}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          tabIdWithoutIndex={tabIdWithoutIndex}
          tabpanelIdWithoutIndex={tabpanelIdWithoutIndex}
        />
      )}
    </div>
  );
});

export default CarouselSidebar;
