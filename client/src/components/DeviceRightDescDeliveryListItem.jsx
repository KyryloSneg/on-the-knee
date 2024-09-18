import "./styles/DeviceRightDescDeliveryListItem.css";
import SelfDeliveryBtn from './SelfDeliveryBtn';
import StringActions from '../utils/StringActions';
import deliveryIcon from "../assets/delivery_24x24_434343.svg";

const DeviceRightDescDeliveryListItem = ({ delivery, deviceSaleTypes }) => {
  const isFreeDelivery = !!deviceSaleTypes?.find(type => type.name === "freeDelivery");

  if (delivery.name === "self-delivery") {
    return <SelfDeliveryBtn variant="device-page" />;
  } else if (delivery.name === "courier") {
    return (
      <div className="device-right-desc-courier-delivery">
        <div className="dev-right-desc-courier-delivery-btn-icon-wrap">
          <div className="dev-right-desc-courier-delivery-icon-wrap">
            <img src={deliveryIcon} alt="" draggable="false" />
          </div>
          <p>
            Courier
          </p>
        </div>
        <span className={isFreeDelivery ? "free-delivery" : ""}>
          {isFreeDelivery ? "For free" : `${delivery.price}$`}
        </span>
      </div>
    );
  }

  // using StringActions.splitByUpperCaseLetters(delivery.name) just in case
  const fallbackName = StringActions.capitalize(StringActions.splitByUpperCaseLetters(delivery.name));
  return <p>{fallbackName} is available</p>;
}

export default DeviceRightDescDeliveryListItem;
