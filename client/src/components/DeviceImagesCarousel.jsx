import "./styles/DeviceImagesCarousel.css";
import ImagesCarousel from "./UI/imagesCarousel/ImagesCarousel";

const DeviceImagesCarousel = ({ device, selectedCombination, textSaleTypes = [], logoSaleTypes = [] }) => {
  if (!textSaleTypes || !logoSaleTypes) return <div />;
  const images = selectedCombination.images;

  return (
    <div className="images-carousel-wrapper">
      <ImagesCarousel
        type="device"
        images={images}
        className="device-page-section device-images-carousel"
        device={device}
        textSaleTypes={textSaleTypes}
        logoSaleTypes={logoSaleTypes}
        toResetOnLocationChange={true}
      />
    </div>
  );
}

export default DeviceImagesCarousel;
