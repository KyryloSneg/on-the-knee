import { Link } from "react-router-dom";
import "./styles/DeviceSellerBlock.css";

const DeviceSellerBlock = ({ seller }) => {
  /* TODO: sellers routing and corresponding link's to props */
  let to = "#";

  return (
    <p className="device-seller-block">
      <span>Seller:</span>
      <Link to={to} className="link-colors">{seller.name}</Link>
    </p>
  );
}

export default DeviceSellerBlock;
