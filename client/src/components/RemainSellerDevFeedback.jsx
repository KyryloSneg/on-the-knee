import "./styles/RemainSellerDevFeedback.css"
import { useContext } from 'react';
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import RemainSellerDevFeedbackDevList from "./RemainSellerDevFeedbackDevList";
import RemainSellerFeedbackSection from "./RemainSellerFeedbackSection";

const POSSIBLE_TYPES = ["default", "userFeedbacks", "modal"];

// devCombosFeedbacksObjArray: [{ deviceCombination: {...}, feedbacks: [{...}, ...] }, ...]
// sellersFeedbacksObjArray: [{ seller: {...}, feedbacks: [{...}, ...] }, ...]
const RemainSellerDevFeedback = observer(({ 
  type = "default", propsSellersFeedbacksObjArray = null, propsDevCombosFeedbacksObjArray = null,
  userOrderDeviceCombinations = null, closeModal = null
}) => {
  const { app } = useContext(Context);
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of RemainSellerDevFeedback is not defined or incorrect");

  let sellersFeedbacksObjArray = propsSellersFeedbacksObjArray;
  let devCombosFeedbacksObjArray = propsDevCombosFeedbacksObjArray;

  if (type === "modal") {
    sellersFeedbacksObjArray = [app.modalRemainSellerFeedbacksObj];
    devCombosFeedbacksObjArray = app.modalRemainDevCombosFeedbacksObj;
  };

  let className = "remain-seller-dev-feedback";
  if (type === "userFeedbacks") {
    className += ` default-version`;
  } else {
    className += ` ${type}-version`;
  }

  return (
    <div className={className}>
      {!!sellersFeedbacksObjArray?.length && (
        <RemainSellerFeedbackSection type={type} sellersFeedbacksObjArray={sellersFeedbacksObjArray} />
      )}
      {!!devCombosFeedbacksObjArray?.length && (
        <section className="remain-dev-feedback-section">
          <div>
            <h3>Leave a device feedback</h3>
          </div>
          <RemainSellerDevFeedbackDevList 
            type={type} 
            devCombosFeedbacksObjArray={devCombosFeedbacksObjArray} 
            userOrderDeviceCombinations={userOrderDeviceCombinations}
            closeModal={closeModal}
          />
        </section>
      )}
    </div>
  );
});

export default RemainSellerDevFeedback;
