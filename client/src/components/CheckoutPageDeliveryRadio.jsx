import "./styles/CheckoutPageDeliveryRadio.css";
import { forwardRef } from "react";
import StringActions from "../utils/StringActions";
import onRadioKeyDown from "../utils/onRadioKeyDown";
import DeliverySectionSelfDeliveryOption from "./DeliverySectionSelfDeliveryOption";
import DeliverySectionCourierOption from "./DeliverySectionCourierOption";

const CheckoutPageDeliveryRadio = forwardRef((
  { delivery, isChecked, onCheck, checkPrev, checkNext }, 
  ref
) => {
  let radioClassName = "radio-div";
  let wrapperClassName = "checkout-page-delivery-radio";

  if (isChecked) {
    radioClassName += " checked";
    wrapperClassName += " checked";
  }

  let childrenToRenderIfChecked = <div />;
  if (delivery.name === "self-delivery") {
    childrenToRenderIfChecked = <DeliverySectionSelfDeliveryOption />;
  } else if (delivery.name === "courier") {
    childrenToRenderIfChecked = <DeliverySectionCourierOption />;
  }

  const isFree = !delivery.price;
  
  return (
    <div className={wrapperClassName}>
      <button 
        role="radio" 
        aria-checked={isChecked} 
        type="button"
        onClick={onCheck}
        onKeyDown={(e) => onRadioKeyDown(e, checkPrev, checkNext)}
        ref={ref}
      >
        <div className={radioClassName} />
        <span>{StringActions.capitalize(delivery.name)} </span>
        <strong className={isFree ? "free" : ""}>
          {isFree ? "Free" : `${delivery.price} $`}
        </strong>
      </button>
      {isChecked && childrenToRenderIfChecked}
    </div>
  );
});

export default CheckoutPageDeliveryRadio;
