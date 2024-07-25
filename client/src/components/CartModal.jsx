import "./styles/CartModal.css";
import { useContext, useEffect, useLayoutEffect } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import CartModalContent from './CartModalContent';
import setCartModalVisibility from '../utils/setCartModalVisibility';
import { observer } from "mobx-react-lite";
import { patchCartDeviceCombination } from "../http/CartAPI";
import useGettingCartData from "../hooks/useGettingCartData";

const CartModal = observer(() => {
  const { app, user } = useContext(Context);
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
      initialDeviceListItemsValues[cartCombo.id] = { value: cartCombo.amount, totalStock: Infinity };
    }

    app.setDeviceListItemsValues(initialDeviceListItemsValues);
  }, [app, user.cartDeviceCombinations]);

  // before closing the modal update combos' amount
  useLayoutEffect(() => {
    return async () => {
      const deviceListItems = Array.from(document.querySelectorAll(".cart-modal-device-list-item"));
      let storageCartCombos = JSON.parse(localStorage.getItem("cartDeviceCombinations")) || [];

      try {
        for (let listItem of deviceListItems) {
          // awaiting just in case of theoretically opened cart right after closing it
          const newAmount = +listItem.dataset.amount;
          const totalStock = listItem.dataset.totalstock;

          // if amount is greater than available total stock of device,
          // set total stock as the new amount
          if (user.isAuth) {
            await patchCartDeviceCombination(
              listItem.dataset.comboid,
              { amount: newAmount > totalStock ? totalStock : newAmount }
            );
          } else {
            let storageCombo = storageCartCombos.find(combo => combo.id === listItem.dataset.comboid);
            storageCombo.amount = newAmount > totalStock ? totalStock : newAmount;
          }
        };

        // updating cart device combinations
        if (user.isAuth) {
          await fetching(user.cart?.id, null, true);
        } else {
          localStorage.setItem("cartDeviceCombinations", JSON.stringify(storageCartCombos));
        }
      } catch (e) {
        console.log(e.message);
      }
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
    />
  );
});

export default CartModal;
