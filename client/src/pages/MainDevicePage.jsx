import "./styles/MainDevicePage.css";
import DeviceImagesCarousel from "../components/DeviceImagesCarousel";
import DeviceInfoSection from "../components/DeviceInfoSection";
import DeviceRightDescription from "../components/DeviceRightDescription";
import CommentsSection from "../components/UI/commentsSection/CommentsSection";

const MainDevicePage = () => {
  return (
    <section className="main-device-page">
      <div className="dev-images-description-wrap">
        <DeviceImagesCarousel />
        <DeviceRightDescription />
      </div>
      <div className="dev-info-comments-wrap">
        <DeviceInfoSection />
        <CommentsSection type="device" />
      </div>
    </section>
  );
}

export default MainDevicePage;
