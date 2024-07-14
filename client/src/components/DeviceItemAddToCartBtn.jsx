import "./styles/DeviceItemAddToCartBtn.css";
import { useContext, useState } from "react";
import addToCartIcon from "../assets/show-cart-button.svg";
import inCartIcon from "../assets/in_cart_24x24_FFF.svg";
import { Context } from "../Context";
import { v4 } from "uuid";
import { createCartDeviceCombination } from "../http/CartAPI";
import { observer } from "mobx-react-lite";
import setCartModalVisibility from "../utils/setCartModalVisibility";

const DeviceItemAddToCartBtn = observer(({ combinations, combo, isWithText = false, isPreOrder = false }) => {
  const { app, user } = useContext(Context);
  const [isAlreadyAdding, setIsAlreadyAdding] = useState(false);

  let className = "main-device-add-to-cart";
  if (isPreOrder) {
    className += " preorder-version";
  }

  async function onClick() {
    if (isAdded) {
      setCartModalVisibility(true, app);
    } else {
      if (isAlreadyAdding) return;

      try {
        setIsAlreadyAdding(true);

        if (user.isAuth) {
          const cartDevCombo = {
            "id": v4(),
            "cartId": user.cart?.id,
            "deviceId": combo.deviceId,
            "device-combinationId": combo.id,
            "amount": 1,
          };

          await createCartDeviceCombination(cartDevCombo);
        } else {
          const newCartDevCombos = [...user.cartDeviceCombinations, combo];
          localStorage.setItem("cartDeviceCombinations", JSON.stringify(newCartDevCombos));
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
    <button className={className} onClick={onClick}>
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
