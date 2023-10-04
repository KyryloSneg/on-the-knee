import cartIcon from "../assets/show-cart-button.svg";
import "./styles/DeviceItemAddToCartBtn.css";

const DeviceItemAddToCartBtn = () => {
  function onClick() {
    // TODO: add to cart
  }
  
  return (
    <button className="main-device-add-to-cart" onClick={onClick}>
      <img src={cartIcon} alt="Add to cart" draggable="false" />
    </button>
  );
}

export default DeviceItemAddToCartBtn;
