import cartIcon from "../assets/show-cart-button.svg";
import "./styles/DeviceItemAddToCartBtn.css";

const DeviceItemAddToCartBtn = ({ isWithText = false, isPreOrder = false }) => {
  let className = "main-device-add-to-cart";
  if (isPreOrder) {
    className += " preorder-version";
  }

  function onClick() {
    // TODO: add to cart
  }
  
  return (
    <button className={className} onClick={onClick}>
      {isWithText && (
        isPreOrder
          ? <span>Preorder</span>
          : <span>Purchase</span>
      )}
      <img src={cartIcon} alt="Add to cart" draggable="false" />
    </button>
  );
}

export default DeviceItemAddToCartBtn;
