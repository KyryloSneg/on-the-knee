import "./styles/UserPageOrderExpandedContent.css";
import UserPageOrderExpandedContentLeft from "./UserPageOrderExpandedContentLeft";
import UserPageOrderExpandedContentRight from "./UserPageOrderExpandedContentRight";

const UserPageOrderExpandedContent = ({ order, seller, additionalServicesObjArray, expandedContentId }) => {
  return (
    <div className="user-page-order-expanded-content" id={expandedContentId}>
      <UserPageOrderExpandedContentLeft order={order} seller={seller} />
      <UserPageOrderExpandedContentRight order={order} additionalServicesObjArray={additionalServicesObjArray} />
    </div>
  );
}

export default UserPageOrderExpandedContent;
