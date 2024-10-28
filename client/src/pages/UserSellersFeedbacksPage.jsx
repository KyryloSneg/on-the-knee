import "./styles/UserSellersFeedbacksPage.css";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";

const UserSellersFeedbacksPage = ({ ordersSellerFeedbacksObjArray }) => {
  if (!ordersSellerFeedbacksObjArray?.length) return <div aria-hidden="true" />;
  
  return (
    <>
      <RemainSellerDevFeedback propsSellersFeedbacksObjArray={ordersSellerFeedbacksObjArray} />
    </>
  );
}

export default UserSellersFeedbacksPage;
