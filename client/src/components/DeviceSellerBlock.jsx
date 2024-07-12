import "./styles/DeviceSellerBlock.css";
import { Link } from "react-router-dom";
import { SELLER_FEEDBACKS_ROUTE, SELLER_ROUTE } from "../utils/consts";
import StarRating from "./UI/starRating/StarRating";

const DeviceSellerBlock = ({ seller }) => {
  let sellerPageTo = SELLER_ROUTE + `${seller.id}--${seller.slug}`;
  let sellerFeedbacksPageTo = SELLER_FEEDBACKS_ROUTE.replace(":sellerIdSlug", `${seller.id}--${seller.slug}`);

  return (
    <div className="device-seller-block">
      <p>
        <span>Seller:</span>
        <Link to={sellerPageTo} className="link-colors">{seller.name}</Link>
      </p>
      <div className="device-seller-block-rating-wrap">
        <StarRating readOnlyValue={1} maxValue={1} width={20} height={20} />
        <p>{seller.rating}</p>
        <Link to={sellerFeedbacksPageTo} className="link-colors">
          ({seller.rating === 0 ? "write a feedback" : "feedbacks"})
        </Link>
      </div>
    </div>
  );

  // return (
  //   <p className="device-seller-block">
  //     <span>Seller:</span>
  //     <Link to={to} className="link-colors">{seller.name}</Link>
  //   </p>
  // );
}

export default DeviceSellerBlock;
