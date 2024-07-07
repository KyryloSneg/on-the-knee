import { Link } from "react-router-dom";
import "./styles/DeviceSellerBlock.css";
import { SELLER_ROUTE } from "../utils/consts";

const DeviceSellerBlock = ({ seller }) => {
  let to = SELLER_ROUTE + `${seller.id}--${seller.slug}`;

  return (
    <p className="device-seller-block">
      <span>Seller:</span>
      <Link to={to} className="link-colors">{seller.name}</Link>
    </p>
  );
}

export default DeviceSellerBlock;
