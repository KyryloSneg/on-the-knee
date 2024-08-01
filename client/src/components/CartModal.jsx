import "./styles/CartModal.css";
import { useContext, useEffect, useLayoutEffect } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import CartModalContent from './CartModalContent';
import setCartModalVisibility from '../utils/setCartModalVisibility';
import { observer } from "mobx-react-lite";
import useGettingCartData from "../hooks/useGettingCartData";
import updateCartData from "../utils/updateCartData";

const CartModal = observer(() => {
  const { app, user, deviceStore } = useContext(Context);
  const fetching = useGettingCartData(app.cart?.id, null, true, false);

  async function setIsCartModalVisible(isVisible) {
    setCartModalVisibility(isVisible, app);
  }

  useEffect(() => {
    let initialDeviceListItemsValues = {};
    for (let cartCombo of user.cartDeviceCombinations) {
      // we can add device to cart and immediately open one,
      // so don't create / overwrite already created fields
      if (initialDeviceListItemsValues[cartCombo.id]) continue;
      let addServicesTotalPrice = 0;

      const selectedAddServices = user.cartSelectedAdditionalServices["selected-additional-services"];
      if (selectedAddServices && selectedAddServices[cartCombo.id]) {
        for (let selectedItem of selectedAddServices[cartCombo.id]) {
          addServicesTotalPrice += +selectedItem.price;
        }
      }

      initialDeviceListItemsValues[cartCombo.id] = {
        value: cartCombo.amount,
        totalStock: Infinity,
        selectedAddServices: selectedAddServices,
        addServicesTotalPrice: addServicesTotalPrice,
      };
    }

    deviceStore.setDeviceListItemsValues(initialDeviceListItemsValues);
  }, [deviceStore, user.cartDeviceCombinations, user.cartSelectedAdditionalServices]);

  // before closing the modal update combos' amount and selected additional services
  useLayoutEffect(() => {
    return async () => {
      // we have need in cleanup function on modal closing only
      if (app.isVisibleCartModal) return;
      await updateCartData(user, fetching);
    }
    // eslint-disable-next-line 
  }, [user.cart?.id]);

  return (
    <ModalWindow
      isVisible={app.isVisibleCartModal}
      setIsVisible={setIsCartModalVisible}
      children={
        <CartModalContent
          closeModal={() => setIsCartModalVisible(false)}
        />
      }
      headerText="Cart"
      id="cart-modal"
      triggerElemRef={app.cartModalBtnRef}
    />
  );
});

export default CartModal;
