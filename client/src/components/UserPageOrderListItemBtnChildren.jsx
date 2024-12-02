import "./styles/UserPageOrderListItemBtnChildren.css";
import getDateStr from "../utils/getDateStr";
import { ORDER_STATUS_COLOR_OBJ } from "../utils/consts";
import getDatetime from "utils/getDatetime";

const UserPageOrderListItemBtnChildren = ({ order, isExpanded }) => {
  const date = new Date(order.date);
  const dateStr = getDateStr(date);

  const datetime = getDatetime(date);

  return (
    <div className="user-page-order-li-btn-main">
      <div>
        <div className="user-page-order-status">
          {/* heading for the order item */}
          <h3 className="user-page-order-name-date">
            <span>№ {order.orderName}</span>
            <time dateTime={datetime}>{dateStr}</time>
          </h3>
          <p
            className="user-page-order-status-msg"
            style={{
              color: ORDER_STATUS_COLOR_OBJ[order.status]
            }}
          >
            {order.status}
          </p>
        </div>
      </div>
      {!isExpanded && (
        <div className="user-page-order-imgs-price-wrap">
          <ul className="user-page-order-dev-imgs-list">
            {order["order-device-combinations"].map(orderCombo =>
              <li key={orderCombo.id}>
                <img
                  loading="lazy"
                  src={orderCombo["device-combination"].images[0].src}
                  alt={isExpanded ? "Collapse" : "Expand"}
                  draggable="false"
                />
              </li>
            )}
          </ul>
          <p className="user-page-order-total-price">
            <span>Paid</span><strong>{order.totalPrice} $</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default UserPageOrderListItemBtnChildren;
