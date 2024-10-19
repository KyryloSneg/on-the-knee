import "./styles/RemainSellerDevFeedbackDevListItem.css"
import { Link } from "react-router-dom";
import { DEVICE_COMMENTS_ROUTE, DEVICE_ROUTE } from "../utils/consts";
import UIButton from "./UI/uiButton/UIButton";

const RemainSellerDevFeedbackDevListItem = ({ combination }) => {
  const deviceRouteCombo = combination.combinationString || "default";

  const deviceTo = DEVICE_ROUTE + `${combination.deviceId}--${deviceRouteCombo}`;;
  const feedbackPageTo = DEVICE_COMMENTS_ROUTE.replace(":deviceIdCombo", `${combination.deviceId}--${deviceRouteCombo}`);

  return (
    <div className="remain-seller-dev-feedback-dev-li">
      <Link to={deviceTo} className="remain-seller-dev-feedback-dev-name-img link-colors">
        <div className="remain-seller-dev-feedback-dev-li-img-wrap">
          <img src={combination.images[0].src} alt="" draggable="false" />
        </div>
        <span>{combination.device.name} ({combination.sku})</span>
      </Link>
      <UIButton variant="primary2" isLink={true} to={feedbackPageTo}>
        Rate this device
      </UIButton>
    </div>
  );
}

export default RemainSellerDevFeedbackDevListItem;
