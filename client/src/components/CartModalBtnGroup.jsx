import "./styles/CartModalBtnGroup.css";
import UIButton from "./UI/uiButton/UIButton";

const CartModalBtnGroup = ({ closeModal }) => {
  return (
    <div className="cart-modal-btn-group">
      <UIButton 
        variant="modal-deny" 
        children="Continue shopping" 
        onClick={closeModal}
      />
      <UIButton variant="modal-submit" children="Checkout" />
    </div>
  );
}

export default CartModalBtnGroup;
