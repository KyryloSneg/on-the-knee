import "./styles/UserSellersFeedbacksPage.css";
import { useContext } from "react";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import useSettingDocumentTitle from "hooks/useSettingDocumentTitle";

const UserSellersFeedbacksPage = observer(() => {
  useSettingDocumentTitle("Your feedbacks on sellers");

  const { user } = useContext(Context);
  if (!user.ordersListSellers?.length) return;
  
  return (
    <RemainSellerDevFeedback type="userFeedbacks" propsSellersFeedbacksObjArray={user.ordersListSellers} />
  );
});

export default UserSellersFeedbacksPage;
