import RemainSellerDevFeedbackDevListItem from "./RemainSellerDevFeedbackDevListItem";

const RemainSellerDevFeedbackDevList = ({ type, devCombosFeedbacksObjArray }) => {
  return (
    <ul className="remain-seller-dev-feedback-list">
      {devCombosFeedbacksObjArray?.map(comboFeedbackObj => 
        <li key={comboFeedbackObj.deviceCombination.id}>
          <RemainSellerDevFeedbackDevListItem type={type} comboFeedbackObj={comboFeedbackObj} />
        </li>
      )}
    </ul>
  );
};

export default RemainSellerDevFeedbackDevList;
