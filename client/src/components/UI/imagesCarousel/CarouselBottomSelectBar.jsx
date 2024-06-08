import "./CarouselBottomSelectBar.css";
import CarouselBottomSelectBarItem from "./CarouselBottomSelectBarItem";

const CarouselBottomSelectBar = ({ images, selectedId, setSelectedId }) => {
  // images determine our select bar items amount
  return (
    <div className="carousel-bottom-select-bar">
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
}

export default CarouselBottomSelectBar;
