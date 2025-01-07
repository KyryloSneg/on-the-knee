import "./styles/UserPageOrderExpandedContent.css";
import UserPageOrderExpandedContentLeft from "./UserPageOrderExpandedContentLeft";
import UserPageOrderExpandedContentRight from "./UserPageOrderExpandedContentRight";

const UserPageOrderExpandedContent = ({ 
  order, sellerFeedbacksObj, additionalServicesObjArray, userDeviceFeedbacksObjArray 
}) => {
  return (
    <div className="user-page-order-expanded-content">
      <UserPageOrderExpandedContentLeft 
        order={order} 
        sellerFeedbacksObj={sellerFeedbacksObj} 
        userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray} 
      />
      <UserPageOrderExpandedContentRight order={order} additionalServicesObjArray={additionalServicesObjArray} />
    </div>
  );
}

export default UserPageOrderExpandedContent;
