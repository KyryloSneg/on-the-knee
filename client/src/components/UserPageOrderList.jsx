import "./styles/UserPageOrderList.css";
import UserPageOrderListItem from "./UserPageOrderListItem";

const UserPageOrderList = ({ orders, ordersSellerFeedbacksObjArray, userDeviceFeedbacksObjArray }) => {
  return (
    <ul className="user-page-order-list">
      {orders?.map(order => 
        <li key={order.id}>
          <UserPageOrderListItem 
            order={order} 
            ordersSellerFeedbacksObjArray={ordersSellerFeedbacksObjArray} 
            userDeviceFeedbacksObjArray={userDeviceFeedbacksObjArray}
          />
        </li>
      )}
    </ul>
  );
}

export default UserPageOrderList;
