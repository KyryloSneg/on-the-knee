import "./styles/WrongCartComboAmountsDeletedListItem.css";
import { DEVICE_ROUTE } from "../utils/consts";
import { Link } from "react-router-dom";

const WrongCartComboAmountsDeletedListItem = ({ deletedCombo }) => {
  const deviceRouteCombo = deletedCombo["device-combination"].combinationString || "default";
  const to = DEVICE_ROUTE + `${deletedCombo.device.id}--${deviceRouteCombo}`;

  return (
    <div className="wrong-cart-combo-amounts-deleted-list-item">
      <Link to={to} className="wrong-cart-combo-amounts-deleted-list-img-wrap">
        <img
          src={deletedCombo["device-combination"].images[0].src}
          alt=""
          draggable="false"
        />
      </Link>
      <Link to={to} className="link-colors">
        {deletedCombo.device.name} ({deletedCombo["device-combination"].sku})
      </Link>
    </div>
  );
}

export default WrongCartComboAmountsDeletedListItem;
