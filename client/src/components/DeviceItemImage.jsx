import "./styles/DeviceItemImage.css";
import { Link } from "react-router-dom";
import DeviceItemSaleIcons from "./DeviceItemSaleIcons";
import DeviceItemImageBtns from "./DeviceItemImageBtns";

const DeviceItemImage = ({ thumbnail, to, deviceId, combinationId, textSaleTypes, withHistoryDeletionBtn }) => {
  return (
    <div className="main-device-item-img">
      <DeviceItemSaleIcons
        saleTypes={textSaleTypes}
        deviceId={deviceId}
        className="main-device-icons-absolute"
      />
      <DeviceItemImageBtns 
        deviceId={deviceId} 
        combinationId={combinationId} 
        withHistoryDeletionBtn={withHistoryDeletionBtn} 
      />
      <Link to={to} className="main-device-img-wrap">
        <img src={thumbnail.src} alt={thumbnail.alt} draggable="false" />
      </Link>
    </div>
  );
}

export default DeviceItemImage;
