import "./styles/CartModal.css";
import { useContext } from 'react';
import ModalWindow from './UI/modalWindow/ModalWindow';
import { Context } from '../Context';
import CartModalContent from './CartModalContent';
import setCartModalVisibility from '../utils/setCartModalVisibility';

const CartModal = () => {
  const { app } = useContext(Context);

  function setIsCartModalVisible(isVisible) {
    setCartModalVisibility(isVisible, app);
  }

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
}

export default CartModal;
