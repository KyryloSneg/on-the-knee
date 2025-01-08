import "./styles/UserPageOrderListItem.css"
import { useContext } from "react";
import UserPageOrderListItemBtnChildren from "./UserPageOrderListItemBtnChildren";
import UserPageOrderExpandedContent from "./UserPageOrderExpandedContent";
import UIDetails from "./UI/uiDetails/UIDetails";
import { observer } from "mobx-react-lite";
import { Context } from "Context";

const UserPageOrderListItem = observer(({ order, userDeviceFeedbacksObjArray }) => {
  const { user } = useContext(Context);
  const additionalServicesObjArray = order["additional-services"] || [];

  const sellerToFindId = order?.["order-device-combinations"]?.[0]?.["device-combination"]?.device?.sellerId;
  const sellerFeedbacksObj = user.ordersListSellers?.find(item => item.seller.id === sellerToFindId) || {};

  const btnChildren = <UserPageOrderListItemBtnChildren order={order} />;
  const contentChildren = (
    <UserPageOrderExpandedContent 
      order={order} 
      sellerFeedbacksObj={sellerFeedbacksObj} 
      userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray}
      additionalServicesObjArray={additionalServicesObjArray}
    />
  );

  return (
    <UIDetails 
      btnChildren={btnChildren}
      contentChildren={contentChildren} 
      isToPassBtnChildIsExpandedProp={true}
    />
  );
});

export default UserPageOrderListItem;
