import "./styles/UserPageOrderListItem.css"
import { useState } from "react";
import UserPageOrderListItemBtnChildren from "./UserPageOrderListItemBtnChildren";
import UserPageOrderExpandedContent from "./UserPageOrderExpandedContent";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";
import UIDetails from "./UI/uiDetails/UIDetails";

const UserPageOrderListItem = ({ order, ordersSellerFeedbacksObjArray, userDeviceFeedbacksObjArray }) => {
  const [additionalServicesObjArray, setAdditionalServicesObjArray] = useState([]);

  const sellerToFindId = order?.["order-device-combinations"]?.[0]?.["device-combination"]?.device?.sellerId;
  const sellerFeedbacksObj = ordersSellerFeedbacksObjArray?.find(item => item.seller.id === sellerToFindId) || {};

  const devices = order?.["order-device-combinations"]?.map(orderCombo => {
    return orderCombo?.["device-combination"]?.device;
  }) || [];

  useGettingAddServicesRelatedData(null, setAdditionalServicesObjArray, true, true, devices);
  const expandedContentId = `${order?.orderName.replaceAll(" ", "")}-expanded-content`;

  const btnChildren = <UserPageOrderListItemBtnChildren order={order} />;
  const contentChildren = (
    <UserPageOrderExpandedContent 
      order={order} 
      sellerFeedbacksObj={sellerFeedbacksObj} 
      userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray}
      additionalServicesObjArray={additionalServicesObjArray}
      expandedContentId={expandedContentId}
    />
  );

  return (
    <UIDetails 
      btnChildren={btnChildren}
      contentChildren={contentChildren} 
      contentId={expandedContentId}
      isToPassBtnChildIsExpandedProp={true}
    />
  );
};

export default UserPageOrderListItem;
