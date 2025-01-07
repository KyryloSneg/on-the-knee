import "./CarouselBottomSelectBar.css";
import { forwardRef } from "react";
import CarouselBottomSelectBarItem from "./CarouselBottomSelectBarItem";

const CarouselBottomSelectBar = forwardRef(({ 
  images, selectedId, setSelectedId, tabIdWithoutIndex, tabpanelIdWithoutIndex 
}, ref) => {
  // images determine our select bar items amount
  return (
    <div className="carousel-bottom-select-bar" ref={ref}>
      <div className="carousel-bottom-select-list" role="tablist">
        {images.map((image, index) =>
          <CarouselBottomSelectBarItem
            key={index}
            id={index}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            tabIdWithoutIndex={tabIdWithoutIndex}
            tabpanelIdWithoutIndex={tabpanelIdWithoutIndex}
          />
        )}
      </div>
    </div>
  );
})

export default CarouselBottomSelectBar;
