import cartIcon from "../assets/show-cart-button.svg";
import "./styles/DeviceItemAddToCartBtn.css";

const DeviceItemAddToCartBtn = ({ isWithText = false }) => {
  function onClick() {
    // TODO: add to cart
  }
  
  return (
    <button className="main-device-add-to-cart" onClick={onClick}>
      {isWithText && <span>Purchase</span>}
      <img src={cartIcon} alt="Add to cart" draggable="false" />
    </button>
  );
}

export default DeviceItemAddToCartBtn;
