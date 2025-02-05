import "./styles/DeviceItemAddToCartBtn.css";
import { useCallback, useContext, useRef, useState } from "react";
import addToCartIcon from "../assets/show-cart-button.svg";
import inCartIcon from "../assets/in_cart_24x24_FFF.svg";
import { Context } from "../Context";
import { v4 } from "uuid";
import { createCartDeviceCombination } from "../http/CartAPI";
import { observer } from "mobx-react-lite";
import setCartModalVisibility from "../utils/setCartModalVisibility";
import { getDevice } from "../http/DeviceApi";
import { getOneDeviceSaleDevices } from "../http/SalesAPI";
import useLodashThrottle from "../hooks/useLodashThrottle";
import updateServerCartSelectedAddServices from "utils/updateServerCartSelectedAddServices";
import Loader from "./UI/loader/Loader";

const DeviceItemAddToCartBtn = observer(({
  combo, selectedAddServices = null, isWithText = false, isPreOrder = false
}) => {
  const { app, user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const isAlreadyAddingRef = useRef(false);
  const btnRef = useRef(null);

  const addToCartLogic = useCallback(async () => {
    if (isAlreadyAddingRef.current) return;
    else isAlreadyAddingRef.current = true;

    setIsLoading(true);

    try {
      let cartDevCombo = {
        "id": v4(),
        "deviceId": combo.deviceId,
        "device-combinationId": combo.id,
        "amount": 1,
      };

      if (user.isAuth) {
        cartDevCombo["cartId"] = user.cart?.id;
        await createCartDeviceCombination(cartDevCombo);
      } else {
        const device = await getDevice(combo.deviceId);
        device["sale-devices"] = await getOneDeviceSaleDevices(device?.id);

        cartDevCombo["cartId"] = user.cart?.id;
        cartDevCombo["device"] = device;
        cartDevCombo["device-combination"] = combo;

        const newCartDevCombos = [...user.cartDeviceCombinations, cartDevCombo];
        localStorage.setItem("cartDeviceCombinations", JSON.stringify(newCartDevCombos));
      }

      if (selectedAddServices?.length) {
        await updateServerCartSelectedAddServices(
          user.cartSelectedAdditionalServices, selectedAddServices, cartDevCombo.id, user.isAuth
        );
      }

      await user.cartDataFetching();
    } catch (e) {
      console.log(e.message);
      throw e;
    } finally {
      isAlreadyAddingRef.current = false;
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [user, isAlreadyAddingRef, combo, selectedAddServices]);

  // using trailing false to prevent invoking the logic twice after double click within 3 seconds
  const throttledAddToCartLogic = useLodashThrottle(addToCartLogic, 3000, { "trailing": false });

  function onClick() {
    const isAdded = !!user.cartDeviceCombinations?.find(cartCombo => combo.id === cartCombo["device-combinationId"]);;

    if (isAdded) {
      app.setCartModalBtnRef(btnRef);
      setCartModalVisibility(true, app);
      return;
    } else {
      throttledAddToCartLogic();
    }
  }

  const isAdded = !!user.cartDeviceCombinations?.find(cartCombo => combo.id === cartCombo["device-combinationId"]);
  const src = isAdded ? inCartIcon : addToCartIcon;

  let childrenContent;
  if (isLoading) {
    childrenContent = <Loader />;
  } else {
    childrenContent = (
      <>
        {isWithText && (
          isAdded
            ? <span>In cart</span>
            : isPreOrder
              ? <span>Preorder</span>
              : <span>Purchase</span>

        )}
        <img src={src} alt={isWithText ? "" : "Add to cart"} draggable="false" />
      </>
    )
  }

  let className = "main-device-add-to-cart";
  if (isAdded) {
    className += " added-version";
  }
  
  if (isPreOrder) {
    className += " preorder-version";
  }

  return (
    <button className={className} onClick={onClick} disabled={isLoading} ref={btnRef}>
      {childrenContent}
    </button>
  );
});

export default DeviceItemAddToCartBtn;
