import "./styles/UserPageOrderExpandedContentRight.css";
import { useContext, useRef } from "react";
import UIButton from "./UI/uiButton/UIButton";
import UserPageOrderExpandedDeviceList from "./UserPageOrderExpandedDeviceList";
import UserPageOrderExpandedPriceSection from "./UserPageOrderExpandedPriceSection";
import setReportOrderProblemModalVisibility from "../utils/setReportOrderProblemModalVisibility";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";

const UserPageOrderExpandedContentRight = observer(({ order, additionalServicesObjArray }) => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);

  function onClick() {
    setReportOrderProblemModalVisibility(true, app);
    
    app.setReportOrderProblemBtnRef(btnRef);
    app.setReportOrderProblemOrderId(order.id);
  }
  
  return (
    <div className="user-page-order-expanded-content-right">
      <UserPageOrderExpandedDeviceList order={order} additionalServicesObjArray={additionalServicesObjArray} />
      <UserPageOrderExpandedPriceSection order={order} />
      <UIButton variant="primary2" onClick={onClick} ref={btnRef}>
        Report a problem
      </UIButton>
    </div>
  );
});

export default UserPageOrderExpandedContentRight;
