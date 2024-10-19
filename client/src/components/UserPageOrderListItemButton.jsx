import "./styles/UserPageOrderListItemButton.css";
import dropdownArrowIcon from "../assets/expand_more.svg";
import getDateStr from "../utils/getDateStr";
import DateActions from "../utils/DateActions";
import { ORDER_STATUS_COLOR_OBJ } from "../utils/consts";

const UserPageOrderListItemButton = ({ order, isExpanded, setIsExpanded, expandedContentId }) => {
  function onClick() {
    setIsExpanded(!isExpanded);
  }

  const date = new Date(order.date);
  const dateStr = getDateStr(date);

  const year = DateActions.getDatePartWithPossibleZeros(date.getFullYear(), 4);
  const month = DateActions.getDatePartWithPossibleZeros(date.getMonth(), 2);
  const monthDay = DateActions.getDatePartWithPossibleZeros(date.getDate(), 2);

  // YYYY-MM-DD
  const datetime = `${year}-${month}-${monthDay}`;

  return (
    <button 
      aria-expanded={isExpanded}
      aria-controls={expandedContentId}
      aria-label={`${isExpanded ? "Collapse" : "Expand"} the order details`}
      className="user-page-order-list-item-btn" 
      onClick={onClick}
    >
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
      <img
        src={dropdownArrowIcon}
        alt={isExpanded ? "Collapse" : "Expand"}
        className={isExpanded ? "rotated" : ""}
        draggable="false"
      />
    </button>
  );
}

export default UserPageOrderListItemButton;
