import "./styles/SelfDeliveryBtn.css";
import deliveryIcon from "../assets/delivery_24x24_434343.svg";
import whiteDeliveryIcon from "../assets/delivery_24x24_white.svg";
import setSelfDeliveryModalVisibility from "../utils/setSelfDeliveryModalVisibility";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import UIButton from "./UI/uiButton/UIButton";

const SelfDeliveryBtn = ({ variant = "default", placeholder = null }) => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);

  function onClick() {
    app.setSelfDeliveryModalBtnRef(btnRef);
    setSelfDeliveryModalVisibility(true, app);
  }

  if (variant === "device-page") {
    return (
      <section className="self-delivery-btn-wrap">
        <div className="self-delivery-icon-btn-wrap">
          <div className="self-delivery-icon-wrap">
            <img src={deliveryIcon} alt="" draggable="false" />
          </div>
          <button
            className="self-delivery-btn link-colors"
            onClick={onClick}
            ref={btnRef}
          >
            {placeholder || "Self-delivery from our stores"}
          </button>
        </div>
        <span className="self-delivery-btn-free">
          For free
        </span>
      </section>
    );
  }

  if (variant === "default") {
    return (
      <UIButton 
        variant="primary1" 
        hasIcon={true} 
        onClick={onClick} 
        ref={btnRef}
      >
        <img src={whiteDeliveryIcon} alt="" draggable="false" />
        <span>{placeholder || "Self-pickup points map"}</span>
      </UIButton>
    );
  }
}

export default SelfDeliveryBtn;