import { useContext, useRef } from "react";
import setAskSellerModalVisibility from "../utils/setAskSellerModalVisibility";
import "./styles/AskSellerBtn.css";
import UIButton from "./UI/uiButton/UIButton";
import { Context } from "../Context";

const AskSellerBtn = ({ seller }) => {
  const { app, deviceStore } = useContext(Context);
  const btnRef = useRef(null);

  function onClick() {
    app.setAskSellerModalBtnRef(btnRef);
    deviceStore.setSelectedSellerId(seller.id);

    setAskSellerModalVisibility(true, app);
  }

  return (
    <UIButton 
      className="ask-seller-btn" 
      onClick={onClick}
      ref={btnRef}
    >
      Ask a question
    </UIButton>
  );
}

export default AskSellerBtn;
