import "./styles/UserPageOrderList.css";
import UserPageOrderListItem from "./UserPageOrderListItem";

const UserPageOrderList = ({ orders }) => {
  return (
    <ul className="user-page-order-list">
      {orders?.map(order => 
        <li key={order.id}>
          <UserPageOrderListItem order={order} />
        </li>
      )}
    </ul>
  );
}

export default UserPageOrderList;
