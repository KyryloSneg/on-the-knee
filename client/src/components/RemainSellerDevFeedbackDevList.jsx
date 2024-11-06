import RemainSellerDevFeedbackDevListItem from "./RemainSellerDevFeedbackDevListItem";

const RemainSellerDevFeedbackDevList = ({ devCombosFeedbacksObjArray }) => {
  return (
    <ul className="remain-seller-dev-feedback-list">
      {devCombosFeedbacksObjArray?.map(comboFeedbackObj => 
        <li key={comboFeedbackObj.deviceCombination.id}>
          <RemainSellerDevFeedbackDevListItem comboFeedbackObj={comboFeedbackObj} />
        </li>
      )}
    </ul>
  );
};

export default RemainSellerDevFeedbackDevList;
