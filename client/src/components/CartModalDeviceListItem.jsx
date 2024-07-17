import "./styles/CartModalDeviceListItem.css";

const CartModalDeviceListItem = ({ combination }) => {
  return (
    <div className="cart-modal-device-list-item">
      {combination.device.name}
    </div>
  );
}

export default CartModalDeviceListItem;
