import "./styles/CartModalContent.css";
import { useContext } from 'react';
import { Context } from '../Context';
import useGettingCartData from '../hooks/useGettingCartData';
import { observer } from 'mobx-react-lite';
import CartModalDeviceList from "./CartModalDeviceList";
import CartModalBtnGroup from "./CartModalBtnGroup";
import DeviceItemPrice from "./DeviceItemPrice";
import _ from "lodash";
import { getDiscountedPriceOrDefaultOne } from "../utils/getDiscountedPrice";
import Loader from "./UI/loader/Loader";

const CartModalContent = observer(({ closeModal }) => {
  const { deviceStore, user } = useContext(Context);
  useGettingCartData(user.cart?.id, null, user);

  const isLoadingContent = _.isEqual(user.cart, {}) || !deviceStore.sales.length || !deviceStore.saleTypeNames.length;

  let totalPrice;
  if (!isLoadingContent) {
    totalPrice = user.cartDeviceCombinations?.reduce((acc, currValue) => {
      const comboPrice = getDiscountedPriceOrDefaultOne(
        currValue["device-combination"], currValue.device, deviceStore.sales, deviceStore.saleTypeNames
      );

      return acc + comboPrice;
    }, 0);
  }

  return (
    <div className="cart-modal-content">
      {isLoadingContent
        ? <Loader className="cart-modal-loader" />
        : (
          <>
            <CartModalDeviceList />
            <div className="cart-modal-total-price-wrap">
              <span>Total:</span>
              <DeviceItemPrice price={totalPrice} />
            </div>
            <CartModalBtnGroup closeModal={closeModal} />
          </>
        )
      }
    </div>
  );
});

export default CartModalContent;
