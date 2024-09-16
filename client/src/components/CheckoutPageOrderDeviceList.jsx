import "./styles/CheckoutPageOrderDeviceList.css";
import CheckoutPageOrderDeviceListItem from './CheckoutPageOrderDeviceListItem';
import { useContext } from "react";
import { Context } from "../Context";
import setCartModalVisibility from "../utils/setCartModalVisibility";

const CheckoutPageOrderDeviceList = ({ order, orderId, cartDataFetching }) => {
  const { app } = useContext(Context);

  function onEditBtnClick() {
    setCartModalVisibility(true, app);
  }

  return (
    <div className="checkout-page-order-device-list-wrap">
      <ul className="checkout-page-order-device-list">
        {order.value.map(combo =>
          <li key={`${orderId}-${combo.id}`}>
            <CheckoutPageOrderDeviceListItem combination={combo} cartDataFetching={cartDataFetching} />
          </li>
        )}
      </ul>
      <button
        type="button"
        className="link-colors"
        onClick={onEditBtnClick}
      >
        Edit devices
      </button>
    </div>
  );
}

export default CheckoutPageOrderDeviceList;
