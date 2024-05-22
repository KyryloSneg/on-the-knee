import "./CarouselContent.css";
import chevronLeftIcon from "../../../assets/chevron-left_24x24-515151.svg";
import chevronRightIcon from "../../../assets/chevron-right_24x24-515151.svg";
import DeviceItemSaleIcons from "../../DeviceItemSaleIcons";

const CarouselContent = ({ type, images, selectedId, setSelectedId, device = null, textSaleTypes = null, logoSaleTypes = null }) => {
  const translateX = `${selectedId * -100}%`;

  function selectPrevImage() {
    setSelectedId(selectedId - 1);
  }

  function selectNextImage() {
    setSelectedId(selectedId + 1);
  }

  // TODO: add device's sales icons upon the image
  return (
    <div className="carousel-content">
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
        <button className="select-prev-image" onClick={selectPrevImage}>
          <img src={chevronLeftIcon} alt="" draggable="false" />
        </button>
      }
      <ul className="carousel-content-list" style={{ transform: `translateX(${translateX})` }}>
        {images.map((image, index) =>
          <li key={index} className="carousel-content-img-wrap">
            <img src={image.src} alt={image.alt} draggable="false" />
          </li>
        )}
      </ul>
      {/* <img src={image.src} alt={image.alt} /> */}
      {(images.length > 1 && selectedId !== images.length - 1) &&
        <button className="select-next-image" onClick={selectNextImage}>
          <img src={chevronRightIcon} alt="" draggable="false" />
        </button>
      }
    </div>
  );
}

export default CarouselContent;
