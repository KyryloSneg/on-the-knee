import { useCallback, useContext, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../Context';
import { deleteCartDeviceCombination, getOneCartDeviceCombinations, patchCartSelectedAdditionalServices } from '../http/CartAPI';
import _ from "lodash";
import updateCartData from "../utils/updateCartData";
import useGettingCartData from "../hooks/useGettingCartData";
import LocalStorageActions from "../utils/LocalStorageActions";
import UIOptions from "./UI/uiOptions/UIOptions";
import deleteFetchWithTryCatch from "utils/deleteFetchWithTryCatch";
import useLodashThrottle from "hooks/useLodashThrottle";
import setErrorModalVisibility from "utils/setErrorModalVisibility";

const CartModalItemOptions = observer(({ combination }) => {
  const { user, app } = useContext(Context);
  const isAlreadyRemovingRef = useRef(false);
  const optionsRef = useRef(null);

  const fetching = useGettingCartData(null, null, true, false);

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, removing the device from your cart has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "cart-modal-item-options-error", className: "" });
    app.setErrorModalBtnRef({ current: optionsRef.current });
    app.setIsToFocusErrorModalPrevModalTriggerElem(false);

    setErrorModalVisibility(true, app);
  }, [app]);

  const removeCallback = useCallback(async () => {
    async function onSuccess() {
      let nextCartDevCombos;
      if (user.isAuth) {
        nextCartDevCombos = await getOneCartDeviceCombinations(user.cart?.id);
      } else {
        nextCartDevCombos = LocalStorageActions.getItem("cartDeviceCombinations");
      }

      user.setCartDeviceCombinations(nextCartDevCombos);
    }

    try {
      if (isAlreadyRemovingRef.current) return;
      isAlreadyRemovingRef.current = true;

      app.setIsCartModalLoading(true);
      // updating cart data because user could change amount and selected additional services for remained combos
      await updateCartData(user, fetching);

      // deleting additional service related to the deleted combo
      let newCartSelectedAdditionalServices = _.cloneDeep(user.cartSelectedAdditionalServices);
      if (newCartSelectedAdditionalServices["selected-additional-services"][combination.id]) {
        delete newCartSelectedAdditionalServices["selected-additional-services"][combination.id]
      };

      if (user.isAuth) {
        await deleteFetchWithTryCatch(async () => await deleteCartDeviceCombination(combination.id));
        await patchCartSelectedAdditionalServices(
          newCartSelectedAdditionalServices.id, 
          { "selected-additional-services": newCartSelectedAdditionalServices["selected-additional-services"] }
        );
      } else {
        const newCombos = user.cartDeviceCombinations?.filter(combo => combo.id !== combination.id) || [];

        localStorage.setItem("cartDeviceCombinations", JSON.stringify(newCombos));
        localStorage.setItem("cartSelectedAddServices", JSON.stringify(newCartSelectedAdditionalServices));
      }

      onSuccess();
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadyRemovingRef.current = false;

      // adding small delay, so the deleting and loading doesn't look edgy on the screen
      setTimeout(() => app.setIsCartModalLoading(false), 70);
    }
  }, [app, combination.id, fetching, openErrorModal, user]);

  // doing all these things (throttling and isAlreadyRemovingRef) just in case
  const throttledRemoveCallback = useLodashThrottle(removeCallback, 500, { "trailing": false });

  const optionsContent = [
    {
      name: "Remove",
      onClick: throttledRemoveCallback,
      svgIcon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343">
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      )
    }
  ];

  return <UIOptions optionsContent={optionsContent} ref={optionsRef} />;
});

export default CartModalItemOptions;
