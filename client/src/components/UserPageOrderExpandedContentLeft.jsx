import "./styles/UserPageOrderExpandedContentLeft.css";
import UIButton from "./UI/uiButton/UIButton";
import { SELLER_ROUTE } from "../utils/consts";
import { Link } from "react-router-dom";
import UserPageOrderExpandedDeliverySection from "./UserPageOrderExpandedDeliverySection";
import { useContext, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setRemainSellerDevFeedbackModalVisibility from "../utils/setRemainSellerDevFeedbackModalVisibility";

const UserPageOrderExpandedContentLeft = observer(({ order, seller }) => {
  const { app } = useContext(Context);
  const btnRef = useRef(null);
  // we can have only one seller in one order
  const sellerPageTo = SELLER_ROUTE + `${seller?.id}--${seller?.slug}`;
  const deviceCombos = order["order-device-combinations"]?.map(orderCombo => orderCombo?.["device-combination"]);

  function onClick() {
    setRemainSellerDevFeedbackModalVisibility(true, app);

    app.setRemainSellerDeviceFeedbackSeller(seller);
    app.setRemainSellerDeviceFeedbackDevCombos(deviceCombos);
    app.setRemainSellerDeviceFeedbackBtnRef(btnRef);
  }

  return (
    <div className="user-page-order-expanded-content-left">
      {seller && 
        <>
          <UIButton onClick={onClick} ref={btnRef}>
            Remain a feedback
          </UIButton>
          <dl className="user-page-order-expanded-seller-info-list">
            <div>
              <dt>Seller:</dt>
              <dd>
                <Link to={sellerPageTo} className="link-colors">
                  {seller?.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Phone number:</dt>
              <dd>
                <a 
                  href={`tel:${seller?.phoneNumber?.replaceAll(" ", "")}`}
                  className="link-colors"
                >
                  {seller?.phoneNumber}
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
