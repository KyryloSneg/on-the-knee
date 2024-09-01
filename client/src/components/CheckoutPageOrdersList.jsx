import "./styles/CheckoutPageOrdersList.css";
import CheckoutPageOrder from "./CheckoutPageOrder";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { FIRST_CHECKOUT_ORDER_ID } from "../utils/consts";
import useGettingOrders from "../hooks/useGettingOrders";

const CheckoutPageOrdersList = observer(({ register, errors, trigger, control, cartDataFetching }) => {
  const [selectedDeliverySection, setSelectedDeliverySection] = useState(FIRST_CHECKOUT_ORDER_ID);
  const orders = useGettingOrders();
  
  const isMultiple = Object.keys(orders)?.length > 1;
  return (
    <ul className="checkout-page-orders-section-list">
      {Object.entries(orders)?.map(([id, order]) =>
        <li key={id}>
          <CheckoutPageOrder 
            order={order} 
            id={id}
            isMultiple={isMultiple}
            register={register}
            errors={errors}
            trigger={trigger}
            control={control}
            selectedDeliverySection={selectedDeliverySection}
            setSelectedDeliverySection={setSelectedDeliverySection}
            cartDataFetching={cartDataFetching}
          />
        </li>
      )}
    </ul>
  );
});

export default CheckoutPageOrdersList;
