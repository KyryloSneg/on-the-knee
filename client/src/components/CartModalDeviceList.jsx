import "./styles/CartModalDeviceList.css";
import CartModalDeviceListItem from "./CartModalDeviceListItem";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const POSSIBLE_TYPES = ["cart", "wrongCartComboAmounts"];
const CartModalDeviceList = observer(({ type, oldCartComboAmounts = null, deletedCartCombos = null }) => {
  const { user } = useContext(Context);
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CartModalDeviceList is not defined or incorrect");

  let combinationsToRender = [];
  if (type === "cart") {
    combinationsToRender = user.cartDeviceCombinations;
  } else if (type === "wrongCartComboAmounts") {
    // do not show preOrder cart combos here
    combinationsToRender = user.cartDeviceCombinations?.filter(cartCombo => !cartCombo.device.isPreOrder);
  }

  return (
    <ul className="cart-modal-device-list">
      {combinationsToRender?.map(combo =>
        <li key={combo.id}>
          <CartModalDeviceListItem 
            combination={combo} 
            type={type} 
            oldCartComboAmounts={oldCartComboAmounts}
            deletedCartCombos={deletedCartCombos}
          />
        </li>
      )}
    </ul>
  );
});

export default CartModalDeviceList;
