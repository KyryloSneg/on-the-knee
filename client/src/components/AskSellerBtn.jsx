import { useContext } from "react";
import setAskSellerModalVisibility from "../utils/setAskSellerModalVisibility";
import "./styles/AskSellerBtn.css";
import UIButton from "./UI/uiButton/UIButton";
import { Context } from "../Context";

const AskSellerBtn = ({ seller }) => {
  const { app } = useContext(Context);

  function onClick() {
    app.setSelectedSellerId(seller.id);
    setAskSellerModalVisibility(true, app);
  }

  return (
    <UIButton 
      className="ask-seller-btn" 
      onClick={onClick}
    >
      Ask a question
    </UIButton>
  );
}

export default AskSellerBtn;
