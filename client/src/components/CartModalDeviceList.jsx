import "./styles/CartModalDeviceList.css";
import CartModalDeviceListItem from "./CartModalDeviceListItem";
import { useContext } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const CartModalDeviceList = observer(() => {
  const { user } = useContext(Context);

  return (
    <ul className="cart-modal-device-list">
      {user.cartDeviceCombinations?.map(combo =>
        <li key={combo.id}>
          <CartModalDeviceListItem combination={combo} />
        </li>
      )}
    </ul>
  );
});

export default CartModalDeviceList;
