import "./styles/CheckoutPageAside.css";
import { observer } from "mobx-react-lite";
import UIButton from "./UI/uiButton/UIButton";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useGettingOrders from "../hooks/useGettingOrders";
import CartComboActions from "../utils/CartComboActions";

const CheckoutPageAside = observer(() => {
  const { app, deviceStore, user } = useContext(Context);
  const checkoutSubmitBtnRef = useRef(null);

  const orders = useGettingOrders();
  const orderAmount = Object.keys(orders).length;
  const prevDeliveryPrice = useRef(0);

  useEffect(() => {
    app.setCheckoutSubmitBtnRef(checkoutSubmitBtnRef);
  }, [app, checkoutSubmitBtnRef]);

  const { deviceAmount, devicePrice } = CartComboActions.getDeviceAmountAndTotalPrice(
    user.cartDeviceCombinations, deviceStore.sales, deviceStore.saleTypeNames
  );

  let devicePriceWord = "Device";
  if (deviceAmount > 1) {
    devicePriceWord = "Devices";
  }

  let deliveryPrice = 0;
  if (app.isToShowAsideDeliveryPrice) {
    deliveryPrice = CartComboActions.getDeliveryTotalPrice(
      orders, app.selectedDeliveryIdValues, app.deliveries, app.isToLiftOnTheFloorValues
    );
  }

  const totalPrice = devicePrice + deliveryPrice;

  let orderWord = "order";
  if (orderAmount > 1) {
    orderWord = "orders";
  }

  const devicePriceStr = (devicePrice?.toFixed(2) || `${devicePrice}`) + "$";
  const deliveryPriceStr = (deliveryPrice?.toFixed(2) || `${deliveryPrice}`) + "$";
  const totalPriceStr = (totalPrice?.toFixed(2) || `${totalPrice}`) + "$";

  useEffect(() => {
    prevDeliveryPrice.current = deliveryPrice;
  }, [deliveryPrice]);

  return (
    <aside className="checkout-page-aside">
      <header>
        <h3>Total</h3>
      </header>
      <dl>
        <div>
          <dt>
            {deviceAmount} {devicePriceWord} price
          </dt>
          <dd>
            {devicePriceStr}
          </dd>
        </div>
        <div>
          <dt>
            Delivery price
          </dt>
          <dd>
            {
              /* it looks smoother when user changes his / her location and we show nothing instead of placeholder "0.00$"
               * (free delivery still works well)  
               */
            }
            {(app.isToShowAsideDeliveryPrice) && <>{deliveryPriceStr}</>}
          </dd>
        </div>
      </dl>
      <p>To pay <strong>{totalPriceStr}</strong></p>
      <UIButton 
        className="checkout-page-submit-btn" 
        type="submit"
        ref={checkoutSubmitBtnRef}
      >
        Checkout {orderWord}
      </UIButton>
    </aside>
  );
});

export default CheckoutPageAside;
