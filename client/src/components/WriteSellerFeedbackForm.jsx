import "./styles/WriteSellerFeedbackForm.css";
import useLodashThrottle from "hooks/useLodashThrottle";
import { useForm } from "react-hook-form";
import UIButton from "./UI/uiButton/UIButton";
import { BASE_OPTIONS } from "utils/inputOptionsConsts";
import useWindowWidth from "hooks/useWindowWidth";
import StarRating from "./UI/starRating/StarRating";
import { useCallback, useContext, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import useNavigateToEncodedURL from "hooks/useNavigateToEncodedURL";
import { SELLER_FEEDBACKS_ROUTE } from "utils/consts";
import { Context } from "Context";
import FilePickerSection from "./UI/filePicker/FilePickerSection";
import FileActions from "utils/FileActions";
import { v4 } from "uuid";
import { createSellerFeedback, getOneSellerFeedbacks } from "http/FeedbacksAPI";
import ServerErrorMsg from "./ServerErrorMsg";

const WriteSellerFeedbackForm = observer(({ sellerId, sellerSlug }) => {
  const { user, app } = useContext(Context);
  const windowWidth = useWindowWidth();
  const navigate = useNavigateToEncodedURL();

  const isAlreadySubmittingRef = useRef(false);
  const submitBtnRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [possibleError, setPossibleError] = useState(null);

  const [isUpToDateRate, setIsUpToDateRate] = useState(0);
  const [isToShowIsUpToDateRateError, setIsToShowIsUpToDateRateError] = useState(false);

  const [deliverySpeedRate, setDeliverySpeedRate] = useState(0);
  const [isToShowDeliverySpeedRateError, setIsToShowDeliverySpeedRateError] = useState(false);

  const [serviceQualityRate, setServiceQualityRate] = useState(0);
  const [isToShowServiceQualityRateError, setIsToShowServiceQualityRateError] = useState(false);

  const [files, setFiles] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur"
  });

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="changing-password-error-modal">
        Unfortunately, sending the feedback has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "seller-feedback-submit-error", className: "" });
    app.setErrorModalBtnRef({ current: submitBtnRef.current });

    setErrorModalVisibility(true, app);
  }, [app]);

  const submitCallback = useCallback(async formFields => {
    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsSubmitting(true);

      const thisSellerFeedbacksFromUsers = await getOneSellerFeedbacks(sellerId, `&userId=${user.user.id}`);
      const hasUserAlreadyLeftAFeedback = !!thisSellerFeedbacksFromUsers?.length;

      if (!hasUserAlreadyLeftAFeedback) {
        const id = v4();
        const date = new Date().toISOString();
  
        const transformedFiles = await Promise.all(
          files.map(file => FileActions.getBase64(file.fileObj))
        );
    
        const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));
        const sellerFeedback = {
          "id": id,
          "sellerId": sellerId,
          "userId": user.user.id,
          "images": filesToSend,
          "message": formFields.comment || "",
          "is-up-to-date-rate": isUpToDateRate,
          "delivery-speed-rate": deliverySpeedRate,
          "service-quality-rate": serviceQualityRate,
          "date": date
        };
  
        await createSellerFeedback(sellerFeedback);

        setPossibleError(null);
        navigate(SELLER_FEEDBACKS_ROUTE.replace(":sellerIdSlug", `${sellerId}--${sellerSlug}`));
      } else {
        // let's pretend it's an error that has come from axios
        setPossibleError({
          response: {
            data: {
              message: "You have already rated this seller"
            }
          }
        })
      }
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    sellerId, sellerSlug, openErrorModal, navigate, isUpToDateRate, 
    deliverySpeedRate, serviceQualityRate, files, user.user?.id
  ]);

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  function onSubmit(formFields) {
    if (isUpToDateRate === 0 || deliverySpeedRate === 0 || serviceQualityRate === 0) {
      if (isUpToDateRate === 0) setIsToShowIsUpToDateRateError(true);
      if (deliverySpeedRate === 0) setIsToShowDeliverySpeedRateError(true);
      if (serviceQualityRate === 0) setIsToShowServiceQualityRateError(true);

      return;
    }

    if (areErrors) return;
    throttledSubmitCallback(formFields);
  }

  const areErrors = (
    !!Object.keys(errors).length || isUpToDateRate === 0
    || deliverySpeedRate === 0 || serviceQualityRate === 0
  );

  const commentRegisterResult = register("comment", {
    ...BASE_OPTIONS,
    validate: {
      ...BASE_OPTIONS.validate,
      isTooLarge: value => value.trim().length <= 3000 || "This field must contain less than or equal to 3000 characters",
    }
  });

  let starSize = 24;
  let isWithStarText = false;

  if (windowWidth >= 480) {
    starSize = 40;
    isWithStarText = true;
  } else if (windowWidth >= 380) {
    starSize = 32;
    isWithStarText = true;
  }

  const isUpToDateParaId = "write-seller-feedback-is-up-to-date-p";
  const deliverySpeedParaId = "write-seller-feedback-delivery-speed-p";
  const serviceQualityParaId = "write-seller-feedback-service-quality-p";

  return (
    <form className="write-seller-feedback-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="write-seller-feedback-form-items">
        <div className="write-seller-feedback-star-rating-wrap">
          <div>
            <p id={isUpToDateParaId}>Is up to date</p>
            <StarRating
              id="write-seller-feedback-is-up-to-date-rate"
              width={starSize}
              height={starSize}
              isWithText={isWithStarText}
              isReadOnly={false}
              settedValue={isUpToDateRate}
              setSettedValue={setIsUpToDateRate}
              onSetCb={() => setIsToShowIsUpToDateRateError(false)}
              aria-labelledby={isUpToDateParaId}
            />
          </div>
          {isToShowIsUpToDateRateError &&
            <p className="write-seller-feedback-error-msg" aria-live="polite">
              Required
            </p>
          }
        </div>
        <div className="write-seller-feedback-star-rating-wrap">
          <div>
            <p id={deliverySpeedParaId}>Delivery speed</p>
            <StarRating
              id="write-seller-feedback-delivery-speed-rate"
              width={starSize}
              height={starSize}
              isWithText={isWithStarText}
              isReadOnly={false}
              settedValue={deliverySpeedRate}
              setSettedValue={setDeliverySpeedRate}
              onSetCb={() => setIsToShowDeliverySpeedRateError(false)}
              aria-labelledby={deliverySpeedParaId}
            />
          </div>
          {isToShowDeliverySpeedRateError &&
            <p className="write-seller-feedback-error-msg" aria-live="polite">
              Required
            </p>
          }
        </div>
        <div className="write-seller-feedback-star-rating-wrap">
          <div>
            <p id={serviceQualityParaId}>Service quality</p>
            <StarRating
              id="write-seller-feedback-service-quality-rate"
              width={starSize}
              height={starSize}
              isWithText={isWithStarText}
              isReadOnly={false}
              settedValue={serviceQualityRate}
              setSettedValue={setServiceQualityRate}
              onSetCb={() => setIsToShowServiceQualityRateError(false)}
              aria-labelledby={serviceQualityParaId}
            />
          </div>
          {isToShowServiceQualityRateError &&
            <p className="write-seller-feedback-error-msg" aria-live="polite">
              Required
            </p>
          }
        </div>
        <div>
          <label>
            Comment
            <textarea className={errors?.comment ? "invalid" : ""} {...commentRegisterResult} />
          </label>
          {errors?.comment &&
            <p className="write-seller-feedback-error-msg" aria-live="polite">
              {errors?.comment?.message || "Error!"}
            </p>
          }
        </div>
      </div>
      <FilePickerSection files={files} setFiles={setFiles} />
      {possibleError && <ServerErrorMsg error={possibleError} />}
      <UIButton 
        type="submit"
        className="write-seller-feedback-submit-btn" 
        isLoading={isSubmitting} 
        disabled={areErrors} 
        ref={submitBtnRef}
      >
        Send the rate
      </UIButton>
    </form>
  );
});

export default WriteSellerFeedbackForm;