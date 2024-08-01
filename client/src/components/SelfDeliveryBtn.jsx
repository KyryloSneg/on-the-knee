import "./styles/SelfDeliveryBtn.css";
import deliveryIcon from "../assets/delivery_24x24_434343.svg";
import setSelfDeliveryModalVisibility from "../utils/setSelfDeliveryModalVisibility";
import { useContext, useRef } from "react";
import { Context } from "../Context";

const SelfDeliveryBtn = () => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);

  function onClick() {
    app.setSelfDeliveryModalBtnRef(btnRef);
    setSelfDeliveryModalVisibility(true, app);
  }

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
          Self-delivery from our stores
        </button>
      </div>
      <span className="self-delivery-btn-free">
        For free
      </span>
    </section>
  );
}

export default SelfDeliveryBtn;