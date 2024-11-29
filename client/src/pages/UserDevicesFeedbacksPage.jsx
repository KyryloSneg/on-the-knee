import "./styles/UserDevicesFeedbacksPage.css";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";

const UserDevicesFeedbacksPage = ({ userDeviceFeedbacksObjArray, orderDeviceCombinations }) => {
  if (!userDeviceFeedbacksObjArray?.length) return <div aria-hidden="true" />;

  return (
    <RemainSellerDevFeedback 
      type="userFeedbacks" 
      propsDevCombosFeedbacksObjArray={userDeviceFeedbacksObjArray} 
      userOrderDeviceCombinations={orderDeviceCombinations}
    />
  );
};

export default UserDevicesFeedbacksPage;
