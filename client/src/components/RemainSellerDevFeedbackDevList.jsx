import RemainSellerDevFeedbackDevListItem from "./RemainSellerDevFeedbackDevListItem";

const RemainSellerDevFeedbackDevList = ({ 
  type, devCombosFeedbacksObjArray, userOrderDeviceCombinations, closeModal 
}) => {
  return (
    <ul className="remain-seller-dev-feedback-list">
      {devCombosFeedbacksObjArray?.map(comboFeedbackObj => 
        <li key={comboFeedbackObj.deviceCombination.id}>
          <RemainSellerDevFeedbackDevListItem 
            type={type} 
            comboFeedbackObj={comboFeedbackObj} 
            userOrderDeviceCombinations={userOrderDeviceCombinations}
            closeModal={closeModal}
          />
        </li>
      )}
    </ul>
  );
};

export default RemainSellerDevFeedbackDevList;
