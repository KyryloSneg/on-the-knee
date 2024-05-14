import { useState } from "react";
import CustomScrollbar from "../customScrollbar/CustomScrollbar";
import CarouselContent from "./CarouselContent";
import CarouselSidebar from "./CarouselSidebar";
import "./ImagesCarousel.css";
import useWindowWidth from "../../../hooks/useWindowWidth";
import { WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR } from "../../../utils/consts";
import CarouselBottomSelectBar from "./CarouselBottomSelectBar";

const POSSIBLE_TYPES = ["default", "device"];
const ImagesCarousel = ({ type = "default", images, className = "", device = null, textSaleTypes = null, logoSaleTypes = null }) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined");
  const windowWidth = useWindowWidth();
  const [selectedId, setSelectedId] = useState(0);
  
  let sectionClassName = "images-carousel";
  if (className) sectionClassName += ` ${className}`;

  const isToRenderBottomSelectBar = type === "device"
    ? windowWidth < WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR && images.length > 1
    : images.length > 1;

  return (
    <section className={sectionClassName}>
      {(type === "device" && windowWidth >= WIDTH_TO_SHOW_DEVICE_CAROUSEL_SIDEBAR && images.length) > 1 &&
        <CustomScrollbar
          className="images-carousel-scrollbar"
          children={
            <CarouselSidebar
              images={images}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          }
        />
      }
      <CarouselContent
        type={type}
        images={images}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        device={device}
        textSaleTypes={textSaleTypes}
        logoSaleTypes={logoSaleTypes}
      />
      {isToRenderBottomSelectBar &&
        <CarouselBottomSelectBar 
          images={images} 
          selectedId={selectedId} 
          setSelectedId={setSelectedId}
        />
      }
    </section>
  );
}

export default ImagesCarousel;
