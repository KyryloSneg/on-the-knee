import "./styles/UserPageOrderListItem.css"
import { useState } from "react";
import UserPageOrderListItemButton from "./UserPageOrderListItemButton";
import UserPageOrderExpandedContent from "./UserPageOrderExpandedContent";
import useOneSellerFetching from "../hooks/useOneSellerFetching";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";

const UserPageOrderListItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [seller, setSeller] = useState(null);
  const [additionalServicesObjArray, setAdditionalServicesObjArray] = useState([]);

  const sellerToFetchId = order?.["order-device-combinations"]?.[0]?.["device-combination"]?.device?.sellerId;
  useOneSellerFetching(sellerToFetchId, setSeller, false);

  const devices = order?.["order-device-combinations"]?.map(orderCombo => {
    return orderCombo?.["device-combination"]?.device;
  }) || [];

  useGettingAddServicesRelatedData(null, setAdditionalServicesObjArray, true, true, devices);
  const expandedContentId = `${order?.orderName.replaceAll(" ", "")}-expanded-content`;

  let className = "user-page-order-list-item";
  if (isExpanded) {
    className += " expanded";
  }

  return (
    <section className={className}>
      <header>
        <UserPageOrderListItemButton 
          order={order} 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded} 
          expandedContentId={expandedContentId}
        />
      </header>
      {isExpanded && (
        <UserPageOrderExpandedContent 
          order={order} 
          seller={seller} 
          additionalServicesObjArray={additionalServicesObjArray}
          expandedContentId={expandedContentId}
        />
      )}
    </section>
  );
}

export default UserPageOrderListItem;
