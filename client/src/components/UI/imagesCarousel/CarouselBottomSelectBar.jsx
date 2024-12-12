import "./CarouselBottomSelectBar.css";
import { forwardRef } from "react";
import CarouselBottomSelectBarItem from "./CarouselBottomSelectBarItem";

const CarouselBottomSelectBar = forwardRef(({ images, selectedId, setSelectedId }, ref) => {
  // images determine our select bar items amount
  return (
    <div className="carousel-bottom-select-bar" ref={ref}>
      <ul className="carousel-bottom-select-list">
        {images.map((image, index) =>
          <li key={index}>
            <CarouselBottomSelectBarItem
              id={index}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </li>
        )}
      </ul>
    </div>
  );
})

export default CarouselBottomSelectBar;
