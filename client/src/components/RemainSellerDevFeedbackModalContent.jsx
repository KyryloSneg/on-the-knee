import "./styles/RemainSellerDevFeedbackModalContent.css"
import { useContext } from 'react';
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import UIButton from "./UI/uiButton/UIButton";
import { SELLER_WRITE_A_FEEDBACK_ROUTE } from "../utils/consts";
import RemainSellerDevFeedbackDevList from "./RemainSellerDevFeedbackDevList";

const RemainSellerDevFeedbackModalContent = observer(() => {
  const { app } = useContext(Context);

  const seller = app.remainSellerDeviceFeedbackSeller;
  const sellerFeedbacksPageTo = SELLER_WRITE_A_FEEDBACK_ROUTE.replace(":sellerIdSlug", `${seller.id}--${seller.slug}`);;

  return (
    <div className="remain-seller-dev-feedback">
      <section>
        <header>
          <h3>Rate a seller</h3>
        </header>
        <div className="modal-remain-seller-feedback-wrap">
          <div>
            <img src={seller.logo} alt="" draggable="false" />
            <p><strong>{seller.name}</strong></p>
          </div>
          <UIButton isLink={true} to={sellerFeedbacksPageTo}>
            Write a feedback
          </UIButton>
        </div>
      </section>
      <section>
        <header>
          <h3>Leave a device feedback</h3>
        </header>
        <RemainSellerDevFeedbackDevList />
      </section>
    </div>
  );
});

export default RemainSellerDevFeedbackModalContent;
