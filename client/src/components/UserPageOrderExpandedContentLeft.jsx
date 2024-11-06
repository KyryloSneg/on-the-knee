import "./styles/UserPageOrderExpandedContentLeft.css";
import UIButton from "./UI/uiButton/UIButton";
import { SELLER_ROUTE } from "../utils/consts";
import { Link } from "react-router-dom";
import UserPageOrderExpandedDeliverySection from "./UserPageOrderExpandedDeliverySection";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setRemainSellerDevFeedbackModalVisibility from "../utils/setRemainSellerDevFeedbackModalVisibility";

const UserPageOrderExpandedContentLeft = observer(({ order, sellerFeedbacksObj, userDeviceFeedbacksObjArray }) => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);
  // we can have only one seller in one order
  const sellerPageTo = SELLER_ROUTE + `${sellerFeedbacksObj?.seller?.id}--${sellerFeedbacksObj?.seller?.slug}`;
  const deviceCombos = order["order-device-combinations"]?.map(orderCombo => orderCombo?.["device-combination"]);
  const devComboIds = deviceCombos?.map(combo => combo.id) || [];

  const orderDevCombosFeedbacksObjArray = userDeviceFeedbacksObjArray?.filter(
    item => devComboIds.includes(item.deviceCombination.id)
  );

  function onClick() {
    setRemainSellerDevFeedbackModalVisibility(true, app);

    app.setModalRemainSellerFeedbacksObj(sellerFeedbacksObj);
    app.setModalRemainDevCombosFeedbacksObj(orderDevCombosFeedbacksObjArray);
    app.setRemainSellerDeviceFeedbackBtnRef(btnRef);
  }

  return (
    <div className="user-page-order-expanded-content-left">
      {sellerFeedbacksObj?.seller && 
        <>
          <UIButton onClick={onClick} ref={btnRef}>
            Remain a feedback
          </UIButton>
          <dl className="user-page-order-expanded-seller-info-list">
            <div>
              <dt>Seller:</dt>
              <dd>
                <Link to={sellerPageTo} className="link-colors">
                  {sellerFeedbacksObj?.seller?.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Phone number:</dt>
              <dd>
                <a 
                  href={`tel:${sellerFeedbacksObj?.seller?.phoneNumber?.replaceAll(" ", "")}`}
                  className="link-colors"
                >
                  {sellerFeedbacksObj?.seller?.phoneNumber}
                </a>
              </dd>
            </div>
          </dl>
        </>
      }
      <UserPageOrderExpandedDeliverySection order={order} />
    </div>
  );
});

export default UserPageOrderExpandedContentLeft;
