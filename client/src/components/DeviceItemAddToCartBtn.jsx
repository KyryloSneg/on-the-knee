import "./styles/DeviceItemAddToCartBtn.css";
import { useContext, useRef, useState } from "react";
import addToCartIcon from "../assets/show-cart-button.svg";
import inCartIcon from "../assets/in_cart_24x24_FFF.svg";
import { Context } from "../Context";
import { v4 } from "uuid";
import { createCartDeviceCombination, getOneCartSelectedAdditionalServices, patchCartSelectedAdditionalServices } from "../http/CartAPI";
import { observer } from "mobx-react-lite";
import setCartModalVisibility from "../utils/setCartModalVisibility";
import { getDevice } from "../http/DeviceApi";
import { getOneDeviceSaleDevices } from "../http/SalesAPI";
import _ from "lodash";
import LocalStorageActions from "../utils/LocalStorageActions";

const DeviceItemAddToCartBtn = observer(({
  combinations, combo, selectedAddServices = null, isWithText = false, isPreOrder = false
}) => {
  const { app, user } = useContext(Context);
  const [isAlreadyAdding, setIsAlreadyAdding] = useState(false);
  const btnRef = useRef(null);

  let className = "main-device-add-to-cart";
  if (isPreOrder) {
    className += " preorder-version";
  }

  async function onClick() {
    if (isAdded) {
      app.setCartModalBtnRef(btnRef);
      setCartModalVisibility(true, app);
      return;
    } else {
      if (isAlreadyAdding) return;

      try {
        setIsAlreadyAdding(true);

        let cartDevCombo = {
          "id": v4(),
          "deviceId": combo.deviceId,
          "device-combinationId": combo.id,
          "amount": 1,
        };

        const cartSelectedAddServicesPlaceholder = {
          "id": null,
          "cartId": null,
          "selected-additional-services": {},
        };

        if (user.isAuth) {
          cartDevCombo["cartId"] = user.cart?.id;
          await createCartDeviceCombination(cartDevCombo);

          try {
            if (selectedAddServices?.length) {
              const cartSelectedAdditionalServices =
                (await getOneCartSelectedAdditionalServices(user.cart?.id))[0]
                || cartSelectedAddServicesPlaceholder;
  
              let newCartSelectedAdditionalServices = _.cloneDeep(cartSelectedAdditionalServices);
              newCartSelectedAdditionalServices["selected-additional-services"][cartDevCombo.id] = selectedAddServices;
  
              await patchCartSelectedAdditionalServices(
                cartSelectedAdditionalServices.id,
                { "selected-additional-services": newCartSelectedAdditionalServices["selected-additional-services"] }
              );
            }
          } catch (e) {
            console.log(e.message);
          }
        } else {
          const device = await getDevice(combo.deviceId);
          device["sale-devices"] = await getOneDeviceSaleDevices(device?.id);

          cartDevCombo["cartId"] = user.cart?.id;
          cartDevCombo["device"] = device;
          cartDevCombo["device-combination"] = combo;

          const newCartDevCombos = [...user.cartDeviceCombinations, cartDevCombo];
          localStorage.setItem("cartDeviceCombinations", JSON.stringify(newCartDevCombos));

          try {
            if (selectedAddServices?.length) {
              let cartSelectedAdditionalServices =
                LocalStorageActions.getItem("cartSelectedAddServices")
                || cartSelectedAddServicesPlaceholder;
  
  
              if (_.isEqual(cartSelectedAdditionalServices, {})) {
                cartSelectedAdditionalServices = cartSelectedAddServicesPlaceholder;
              }
  
              let newCartSelectedAdditionalServices = _.cloneDeep(cartSelectedAdditionalServices);
              newCartSelectedAdditionalServices["selected-additional-services"][cartDevCombo.id] = selectedAddServices;
  
              localStorage.setItem("cartSelectedAddServices", JSON.stringify(newCartSelectedAdditionalServices));
            }
          } catch (e) {
            console.log(e.message);
          }
        }

        user.cartDataFetching();
      } catch (e) {
        console.log(e.message);
      } finally {
        setIsAlreadyAdding(false);
      }
    }

  }

  const isAdded = !!user.cartDeviceCombinations?.find(cartCombo => !!combinations?.find(devCombo => devCombo.id === cartCombo["device-combinationId"]));
  const src = isAdded ? inCartIcon : addToCartIcon;

  return (
    <button className={className} onClick={onClick} ref={btnRef}>
      {isWithText && (
        isAdded
          ? <span>In cart</span>
          : isPreOrder
            ? <span>Preorder</span>
            : <span>Purchase</span>

      )}
      <img src={src} alt={isWithText ? "" : "Add to cart"} draggable="false" />
    </button>
  );
});

export default DeviceItemAddToCartBtn;
