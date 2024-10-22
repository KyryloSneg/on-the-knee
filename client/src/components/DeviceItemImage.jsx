import "./styles/DeviceItemImage.css";
import { Link } from "react-router-dom";
import AddToDesiredListBtn from "./AddToDesiredListBtn";
import DeviceItemSaleIcons from "./DeviceItemSaleIcons";

const DeviceItemImage = ({ thumbnail, to, deviceId, combinationId, textSaleTypes }) => {
  return (
    <div className="main-device-item-img">
      <DeviceItemSaleIcons
        saleTypes={textSaleTypes}
        deviceId={deviceId}
        className="main-device-icons-absolute"
      />
      <AddToDesiredListBtn deviceId={deviceId} deviceCombinationId={combinationId} />
      <Link to={to} className="main-device-img-wrap">
        <img src={thumbnail.src} alt={thumbnail.alt} draggable="false" />
      </Link>
    </div>
  );
}

export default DeviceItemImage;
