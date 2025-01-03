import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";
import "./styles/UserDevicesFeedbacksPage.css";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";

const UserDevicesFeedbacksPage = ({ userDeviceFeedbacksObjArray, orderDeviceCombinations }) => {
  useSettingDocumentTitle("Your feedbacks on devices");
  if (!userDeviceFeedbacksObjArray?.length) return;

  return (
    <RemainSellerDevFeedback 
      type="userFeedbacks" 
      propsDevCombosFeedbacksObjArray={userDeviceFeedbacksObjArray} 
      userOrderDeviceCombinations={orderDeviceCombinations}
    />
  );
};

export default UserDevicesFeedbacksPage;
