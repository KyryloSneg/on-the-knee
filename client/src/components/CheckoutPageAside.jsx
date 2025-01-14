import "./styles/CheckoutPageAside.css";
import { observer } from "mobx-react-lite";
import UIButton from "./UI/uiButton/UIButton";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import useGettingOrders from "../hooks/useGettingOrders";
import CartComboActions from "../utils/CartComboActions";

const CheckoutPageAside = observer(({ isSubmitting }) => {
  const { app, deviceStore, user } = useContext(Context);
  const checkoutSubmitBtnRef = useRef(null);

  const orders = useGettingOrders();
  const orderAmount = Object.keys(orders).length;
  const prevDeliveryPrice = useRef(0);

  useEffect(() => {
    app.setCheckoutSubmitBtnRef(checkoutSubmitBtnRef);
  }, [app, checkoutSubmitBtnRef]);

  const { deviceAmount, devicePrice } = CartComboActions.getDeviceAmountAndTotalPrice(
    user.cartDeviceCombinations, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales
  );

  let devicePriceWord = "Device";
  if (deviceAmount > 1) {
    devicePriceWord = "Devices";
  }

  let additionalServicesPrice = 0;
  let additionalServicesAmount = 0;

  const selectedAddServicesObj = user.cartSelectedAdditionalServices["selected-additional-services"];
  for (let [, services] of Object.entries(selectedAddServicesObj)) {
    additionalServicesAmount += services.length;

    for (let addService of services) {
      additionalServicesPrice += +addService.price;
    }
  }

  let addServicesPriceWord = "Service";
  if (additionalServicesAmount > 1) {
    addServicesPriceWord = "Services";
  }

  let deliveryPrice = 0;
  if (app.isToShowAsideDeliveryPrice) {
    deliveryPrice = CartComboActions.getDeliveryTotalPrice(
      orders, app.selectedDeliveryIdValues, app.deliveries, app.isToLiftOnTheFloorValues
    );
  }

  const totalPrice = devicePrice + additionalServicesPrice + deliveryPrice;

  let orderWord = "order";
  if (orderAmount > 1) {
    orderWord = "orders";
  }

  const devicePriceStr = (devicePrice?.toFixed(2) || `${devicePrice}`) + "$";
  const additionalServicesPriceStr = (additionalServicesPrice?.toFixed(2) || `${additionalServicesPrice}`) + "$";
  const deliveryPriceStr = (deliveryPrice?.toFixed(2) || `${deliveryPrice}`) + "$";
  const totalPriceStr = (totalPrice?.toFixed(2) || `${totalPrice}`) + "$";

  useEffect(() => {
    prevDeliveryPrice.current = deliveryPrice;
  }, [deliveryPrice]);

  return (
    <aside className="checkout-page-aside">
      <h3>Total</h3>
      <dl>
        <div>
          <dt>
            {deviceAmount} {devicePriceWord} price
          </dt>
          <dd>
            {devicePriceStr}
          </dd>
        </div>
        {!!additionalServicesAmount && (
          <div>
            <dt>
              {additionalServicesAmount} {addServicesPriceWord} price
            </dt>
            <dd>
              {additionalServicesPriceStr}
            </dd>
          </div>
        )}
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
        isLoading={isSubmitting}
        ref={checkoutSubmitBtnRef}
      >
        Checkout {orderWord}
      </UIButton>
    </aside>
  );
});

export default CheckoutPageAside;
