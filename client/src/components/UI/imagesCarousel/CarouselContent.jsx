import "./CarouselContent.css";
import chevronLeftIcon from "../../../assets/chevron-left_24x24-515151.svg";
import chevronRightIcon from "../../../assets/chevron-right_24x24-515151.svg";
import DeviceItemSaleIcons from "../../DeviceItemSaleIcons";
import { forwardRef, useImperativeHandle, useRef } from "react";

const CarouselContent = forwardRef(({
  type, images, selectedId, selectPrevImage, selectNextImage,
  device = null, textSaleTypes = null, logoSaleTypes = null
}, ref) => {
  const carouselContentRef = useRef(null)
  const selectPrevImgBtnRef = useRef(null)
  const selectNextImgBtnRef = useRef(null)

  const translateX = `${selectedId * -100}%`;

  // handling multiple refs
  useImperativeHandle(ref, () => {
    return {
      get carouselContent() {
        return carouselContentRef.current;
      },

      get selectPrevImgBtn() {
        return selectPrevImgBtnRef.current;
      },

      get selectNextImgBtn() {
        return selectNextImgBtnRef.current;
      }
    };
  })

  return (
    <div className="carousel-content" ref={carouselContentRef}>
      {(type === "device" && device) && [
        <DeviceItemSaleIcons
          key="text"
          saleTypes={textSaleTypes}
          deviceId={device.id}
          className="carousel-content-text-sale-icons"
        />,
        <DeviceItemSaleIcons
          key="logo"
          saleTypes={logoSaleTypes}
          deviceId={device.id}
          className="carousel-content-logo-sale-icons"
        />
      ]}
      {(images.length > 1 && selectedId !== 0) &&
        <button className="select-prev-image" onClick={selectPrevImage} ref={selectPrevImgBtnRef}>
          <img src={chevronLeftIcon} alt="" draggable="false" />
        </button>
      }
      <ul className="carousel-content-list" style={{ transform: `translateX(${translateX})` }}>
        {images.map((image, index) =>
          <li key={index} className="carousel-content-img-wrap">
            <img src={image.src} alt={image.alt} draggable="false" style={image?.style || {}} />
          </li>
        )}
      </ul>
      {(images.length > 1 && selectedId !== images.length - 1) &&
        <button className="select-next-image" onClick={selectNextImage} ref={selectNextImgBtnRef}>
          <img src={chevronRightIcon} alt="" draggable="false" />
        </button>
      }
    </div>
  );
})

export default CarouselContent;
