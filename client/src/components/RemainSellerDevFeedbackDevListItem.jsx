import { Link } from "react-router-dom";
import { DEVICE_COMMENTS_ROUTE, DEVICE_ROUTE } from "../utils/consts";
import UIButton from "./UI/uiButton/UIButton";
import CommentsList from "./CommentsList";
import { v4 } from "uuid";
import UIDetails from "./UI/uiDetails/UIDetails";

const RemainSellerDevFeedbackDevListItem = ({ type, comboFeedbackObj, userOrderDeviceCombinations, closeModal }) => {
  const deviceRouteCombo = comboFeedbackObj.deviceCombination.combinationString || "default";

  const deviceTo = DEVICE_ROUTE + `${comboFeedbackObj.deviceCombination.deviceId}--${deviceRouteCombo}`;
  const feedbackPageTo = DEVICE_COMMENTS_ROUTE.replace(
    ":deviceIdCombo", `${comboFeedbackObj.deviceCombination.deviceId}--${deviceRouteCombo}`
  );

  const hasAnyFeedbackRemained = !!comboFeedbackObj.feedbacks?.length;
  const linkWithDevNameImg = (
    <Link to={deviceTo} className="remain-seller-dev-feedback-li-name-img link-colors">
      <div className="remain-seller-dev-feedback-li-img-wrap">
        <img src={comboFeedbackObj.deviceCombination.images[0].src} alt="" draggable="false" />
      </div>
      <h4>{comboFeedbackObj.deviceCombination.device.name} ({comboFeedbackObj.deviceCombination.sku})</h4>
    </Link>
  );

  if (hasAnyFeedbackRemained) {
    const commentsListId = v4();
    return (
      <UIDetails 
        btnChildren={linkWithDevNameImg}
        contentChildren={
          <CommentsList 
            type="deviceFeedbacks" 
            comments={comboFeedbackObj.feedbacks} 
            singularCommentWord="feedback" 
            isInModal={type === "modal"}
            isInUserFeedbacksModal={type === "modal"}
            areUserFeedbacks={type === "userFeedbacks"}
            userOrderDeviceCombinations={userOrderDeviceCombinations}
            id={commentsListId}
            closeRemainAFeedbackModal={closeModal}
          />
        }
        contentId={commentsListId}
        propsClassName="remain-seller-dev-feedback-li-with-comments"
      />
    );
  };

  return (
    <section className="remain-seller-dev-feedback-li-empty">
      {linkWithDevNameImg}
      <UIButton variant="primary2" isLink={true} to={feedbackPageTo}>
        Rate this device
      </UIButton>
    </section>
  );
};

export default RemainSellerDevFeedbackDevListItem;
