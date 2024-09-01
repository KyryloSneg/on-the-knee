import "./styles/CheckoutPageAside.css";
import { observer } from "mobx-react-lite";
import UIButton from "./UI/uiButton/UIButton";
import { useContext } from "react";
import { Context } from "../Context";
import useGettingOrders from "../hooks/useGettingOrders";

const CheckoutPageAside = observer(() => {
  const { app, user } = useContext(Context);

  const orders = useGettingOrders();
  const orderAmount = Object.keys(orders).length;

  let deviceAmount = 0;
  let devicePrice = 0;

  for (let cartCombo of user.cartDeviceCombinations) {
    if (cartCombo?.amount) {
      deviceAmount += +cartCombo.amount;

      if (cartCombo?.["device-combination"]?.price) {
        devicePrice += +cartCombo?.["device-combination"]?.price * +cartCombo.amount;
      }
    }
  }

  let devicePriceWord = "Device";
  if (deviceAmount > 1) {
    devicePriceWord = "Devices";
  }

  let deliveryPrice = 0;
  for (let selectedDeliveryIdValue of Object.values(app.selectedDeliveryIdValues || {})) {
    const selectedDelivery = app.deliveries?.find(delivery => delivery?.id === selectedDeliveryIdValue?.value);
    deliveryPrice += +selectedDelivery?.price || 0;
  }

  const totalPrice = devicePrice + deliveryPrice;

  let orderWord = "order";
  if (orderAmount > 1) {
    orderWord = "orders";
  }

  const devicePriceStr = (devicePrice?.toFixed(2) || `${devicePrice}`) + "$";
  const deliveryPriceStr = (deliveryPrice?.toFixed(2) || `${deliveryPrice}`) + "$";
  const totalPriceStr = (totalPrice?.toFixed(2) || `${totalPrice}`) + "$";

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
            {/* it looks smoother when user changes his / her location and we show nothing instead of placeholder "0.00$" */}
            {!!deliveryPrice && <>{deliveryPriceStr}</>}
          </dd>
        </div>
      </dl>
      <p>To pay <strong>{totalPriceStr}</strong></p>
      <UIButton className="checkout-page-submit-btn" type="submit">
        Checkout {orderWord}
      </UIButton>
    </aside>
  );
});

export default CheckoutPageAside;
