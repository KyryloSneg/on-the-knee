import "./styles/UserSellersFeedbacksPage.css";
import { useContext } from "react";
import RemainSellerDevFeedback from "components/RemainSellerDevFeedback";
import { Context } from "Context";
import { observer } from "mobx-react-lite";

const UserSellersFeedbacksPage = observer(() => {
  const { user } = useContext(Context);
  if (!user.ordersListSellers?.length) return <div aria-hidden="true" />;
  
  return (
    <RemainSellerDevFeedback type="userFeedbacks" propsSellersFeedbacksObjArray={user.ordersListSellers} />
  );
});

export default UserSellersFeedbacksPage;
