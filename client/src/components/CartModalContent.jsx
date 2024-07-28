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
  const { deviceStore, user, app } = useContext(Context);
  useGettingCartData(user.cart?.id, null, user);

  const areCombosAndValuesSynced = Object.keys(app.deviceListItemsValues || {})?.length !== user.cartDeviceCombinations?.length;
  const isLoadingContent = (
    (user.isAuth && !_.isEqual(user.user, {})) && _.isEqual(user.cart, {})
  ) || !deviceStore.sales?.length || !deviceStore.saleTypeNames?.length || !app.deviceListItemsValues
  || !Object.keys(user.cartSelectedAdditionalServices)?.length || areCombosAndValuesSynced;

  let totalPrice;
  if (!isLoadingContent) {
    totalPrice = user.cartDeviceCombinations?.reduce((acc, currValue) => {
      const comboPrice = getDiscountedPriceOrDefaultOne(
        currValue["device-combination"], currValue.device, deviceStore.sales, deviceStore.saleTypeNames
      );

      const itemValue = app.deviceListItemsValues[currValue.id];
      // there's some weird bug that causes itemValue to be undefined or null, so handle it
      if (!itemValue) return acc + 0;
      // if value is too big, show price of max device amount
      const amount = itemValue.value > itemValue.totalStock ? itemValue.totalStock : itemValue.value;

      return acc + (comboPrice * amount) + itemValue.addServicesTotalPrice;
    }, 0);

    totalPrice = totalPrice.toFixed(2);
  }

  return (
    <div className="cart-modal-content">
      {(isLoadingContent || app.isCartModalLoading)
        ? <Loader className="cart-modal-loader" />
        : (
          <>
            {!!user.cartDeviceCombinations?.length
              ? (
                <>
                  <CartModalDeviceList />
                  <div className="cart-modal-total-price-wrap">
                    <span>Total:</span>
                    <DeviceItemPrice price={totalPrice} />
                  </div>
                </>
              )
              : <p className="empty-cart-msg">The cart is empty</p>
            }

            <CartModalBtnGroup closeModal={closeModal} />
          </>
        )
      }
    </div>
  );
});

export default CartModalContent;
