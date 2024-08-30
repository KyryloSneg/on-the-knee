import "./styles/CheckoutPageOrdersList.css";
import CheckoutPageOrder from "./CheckoutPageOrder";
import { observer } from "mobx-react-lite";
import { useContext, useMemo, useState } from "react";
import { Context } from "../Context";
import { FIRST_CHECKOUT_ORDER_ID } from "../utils/consts";

const CheckoutPageOrdersList = observer(({ register, errors, trigger, control, cartDataFetching }) => {
  const { user } = useContext(Context);
  const [selectedDeliverySection, setSelectedDeliverySection] = useState(FIRST_CHECKOUT_ORDER_ID);

  const orders = useMemo(() => {
    const combinationSellerIds = user.cartDeviceCombinations?.map(combo => combo?.device?.sellerId) || [];
    const uniqueCombinationSellerIds = Array.from(new Set(combinationSellerIds));

    let id = FIRST_CHECKOUT_ORDER_ID;
    let result = {};

    for (let sellerId of uniqueCombinationSellerIds) {
      if (!sellerId) return;
      // adding a new combo
      result[id] = user.cartDeviceCombinations?.filter(combo => combo?.device?.sellerId === sellerId);
      id++;
    }

    return result;
  }, [user.cartDeviceCombinations]);

  
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
