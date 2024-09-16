import "./styles/CartModal.css";
import { useContext } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import CartModalContent from './CartModalContent';
import setCartModalVisibility from '../utils/setCartModalVisibility';
import { observer } from "mobx-react-lite";
import useSettingInitialDeviceListItemsValues from "../hooks/useSettingInitialDeviceListItemsValues";
import useUpdatingCartDataOnModalClose from "../hooks/useUpdatingCartDataOnModalClose";

const CartModal = observer(() => {
  const { app } = useContext(Context);

  async function setIsCartModalVisible(isVisible) {
    setCartModalVisibility(isVisible, app);
  }

  useSettingInitialDeviceListItemsValues();
  useUpdatingCartDataOnModalClose("cart");

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
