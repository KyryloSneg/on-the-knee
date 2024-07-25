import "./styles/CartModalItemOptions.css";
import { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../Context';
import useClickOnEverything from '../hooks/useClickOnEverything';
import { deleteCartDeviceCombination, getOneCartDeviceCombinations } from '../http/CartAPI';

const CartModalItemOptions = observer(({ combination }) => {
  const { user, app } = useContext(Context);
  const wrapperRef = useRef(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  function onOpen() {
    setIsPopupVisible(true);
  }

  function onClose() {
    setIsPopupVisible(false);
  }

  async function onRemove() {
    async function onSuccess() {
      const nextCartDevCombos = await getOneCartDeviceCombinations(user.cart?.id);
      user.setCartDeviceCombinations(nextCartDevCombos);
    }

    try {
      app.setIsCartModalLoading(true);

      await deleteCartDeviceCombination(combination.id)
      onSuccess();
    } catch (e) {
      if (e.response.status === 500) {
        onSuccess();
      } else {
        console.log(e.message);
      }
    } finally {
      // adding small delay, so the deleting and loading doesn't look edgy on the screen
      setTimeout(() => app.setIsCartModalLoading(false), 70);
      onClose();
    }
  }

  useClickOnEverything(onClose, wrapperRef, null, true);

  return (
    <div className="cart-modal-item-options-wrap" ref={wrapperRef}>
      {isPopupVisible
        ? (
          <div className="cart-modal-item-options-popup" aria-live="polite">
            <button
              className="cart-modal-item-options-btn link-colors"
              onClick={onRemove}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
              Remove
            </button>
          </div>
        )
        : (
          <button
            className="cart-modal-item-options-btn cart-open-options-btn link-colors"
            onClick={onOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343" role="img" aria-label="Options">
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
            </svg>
          </button>
        )
      }
    </div>
  );
});

export default CartModalItemOptions;
