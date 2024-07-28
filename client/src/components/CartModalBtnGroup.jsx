import "./styles/CartModalBtnGroup.css";
import { CHECKOUT_ROUTE } from "../utils/consts";
import UIButton from "./UI/uiButton/UIButton";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../Context";

const CartModalBtnGroup = observer(({ closeModal }) => {
  const { user } = useContext(Context);
  const isBlockedSubmit = user.cartDeviceCombinations?.length === 0 || !user.cartDeviceCombinations;

  let submitClassName = "";
  if (isBlockedSubmit) {
    submitClassName = "disabled";
  }

  function onSubmitClick(e) {
    if (isBlockedSubmit) e.preventDefault();
  }

  return (
    <div className="cart-modal-btn-group">
      <UIButton 
        variant="modal-deny" 
        children="Continue shopping" 
        onClick={closeModal}
      />
      <UIButton 
        variant="modal-submit" 
        children="Checkout" 
        isLink={true}
        to={CHECKOUT_ROUTE}
        className={submitClassName}
        onClick={onSubmitClick}
      />
    </div>
  );
});

export default CartModalBtnGroup;
