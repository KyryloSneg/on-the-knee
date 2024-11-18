import "./styles/WriteSellerFeedbackForm.css";
import useLodashThrottle from "hooks/useLodashThrottle";
import { useForm } from "react-hook-form";
import UIButton from "./UI/uiButton/UIButton";
import { BASE_OPTIONS } from "utils/inputOptionsConsts";
import useWindowWidth from "hooks/useWindowWidth";
import StarRating from "./UI/starRating/StarRating";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import useNavigateToEncodedURL from "hooks/useNavigateToEncodedURL";
import { SELLER_FEEDBACKS_ROUTE } from "utils/consts";
import { Context } from "Context";
import FilePickerSection from "./UI/filePicker/FilePickerSection";
import FileActions from "utils/FileActions";
import { v4 } from "uuid";
import { createSellerFeedback, getOneSellerFeedbacks, patchSellerFeedback } from "http/FeedbacksAPI";
import ServerErrorMsg from "./ServerErrorMsg";
import { getOneUserOrders } from "http/OrderAPI";
import { getDeviceCombination } from "http/DeviceApi";
import _ from "lodash";

const WriteSellerFeedbackForm = observer(({ 
  sellerId, sellerSlug, setIsEditing = null, isEditCommentForm = false, comment = null, sellerFeedbacksFetching = null 
}) => {
  const { user, app } = useContext(Context);
  const windowWidth = useWindowWidth();
  const navigate = useNavigateToEncodedURL();

  const isAlreadySubmittingRef = useRef(false);
  const submitBtnRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [possibleError, setPossibleError] = useState(null);

  const [isUpToDateRate, setIsUpToDateRate] = useState(comment?.["is-up-to-date-rate"] || 0);
  const [isToShowIsUpToDateRateError, setIsToShowIsUpToDateRateError] = useState(false);

  const [deliverySpeedRate, setDeliverySpeedRate] = useState(comment?.["delivery-speed-rate"] || 0);
  const [isToShowDeliverySpeedRateError, setIsToShowDeliverySpeedRateError] = useState(false);

  const [serviceQualityRate, setServiceQualityRate] = useState(comment?.["service-quality-rate"] || 0);
  const [isToShowServiceQualityRateError, setIsToShowServiceQualityRateError] = useState(false);

  const filesFromComment = useMemo(() => comment?.images?.map(image => {
    let result = image instanceof File ? image.fileObj : FileActions.getFileFromBase64(image.fileObj);

    let imageCopy = _.cloneDeep(image);
    imageCopy.fileObj = result;

    return imageCopy;
  }), [comment?.images]);

  const [files, setFiles] = useState(filesFromComment || []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      comment: comment?.message || ""
    }
  });

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
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

      if (isEditCommentForm) {
        const areEditedValuesAreTheSameAsBefore = (
          isEditCommentForm
            ? (
              formFields.comment.trim() === comment.message.trim()
              && isUpToDateRate === comment["is-up-to-date-rate"]
              && deliverySpeedRate === comment["delivery-speed-rate"]
              && serviceQualityRate === comment["service-quality-rate"]
              && _.isEqual(files, filesFromComment || [])
            )
            : false
        );

        if (!areEditedValuesAreTheSameAsBefore) {
          const transformedFiles = await Promise.all(
            files.map(file => FileActions.getBase64(file.fileObj))
          );
      
          const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));

          let feedbackFieldsToUpdate = {};
    
          if (!_.isEqual(filesFromComment || [], files)) feedbackFieldsToUpdate.images = filesToSend;
          if (comment.message.trim() !== formFields.comment.trim()) feedbackFieldsToUpdate.message = formFields.comment.trim();

          if (comment["is-up-to-date-rate"] !== isUpToDateRate) feedbackFieldsToUpdate["is-up-to-date-rate"] = isUpToDateRate;
          if (comment["delivery-speed-rate"] !== deliverySpeedRate) {
            feedbackFieldsToUpdate["delivery-speed-rate"] = deliverySpeedRate;
          }

          if (comment["service-quality-rate"] !== serviceQualityRate) {
            feedbackFieldsToUpdate["service-quality-rate"] = serviceQualityRate;
          }
  
          if (Object.keys(feedbackFieldsToUpdate).length) {
            if (!comment.isEdited) feedbackFieldsToUpdate.isEdited = true;

            await patchSellerFeedback(comment.id, feedbackFieldsToUpdate);
            await sellerFeedbacksFetching();
          }
        }
      } else {
        const allUserOrders = await getOneUserOrders(user.user.id, "&_embed=order-device-combinations");
        let haveUserBoughtAnythingFromThisSeller = false;
  
        for (let order of allUserOrders) {
          for (let orderCombo of order["order-device-combinations"]) {
            const devCombo = await getDeviceCombination(orderCombo["device-combinationId"], "_expand=device");
            
            if (devCombo.device.sellerId === sellerId) {
              haveUserBoughtAnythingFromThisSeller = true;
              break;
            }
          }
        }
  
        if (!haveUserBoughtAnythingFromThisSeller) {
          // let's pretend it's an error that has come from axios
          setPossibleError({
            response: {
              data: {
                message: "You haven't bought anything from this seller"
              }
            }
          })
        } else {
          const thisSellerFeedbacksFromUsers = await getOneSellerFeedbacks(sellerId, `&userId=${user.user.id}`);
          const hasUserAlreadyLeftAFeedback = !!thisSellerFeedbacksFromUsers?.length;
  
          if (hasUserAlreadyLeftAFeedback) {
            // let's pretend it's an error that has come from axios
            setPossibleError({
              response: {
                data: {
                  message: "You have already rated this seller"
                }
              }
            })
          } else {
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
              "date": date,
              "isEdited": false
            };
      
            await createSellerFeedback(sellerFeedback);
      
            setPossibleError(null);
            navigate(SELLER_FEEDBACKS_ROUTE.replace(":sellerIdSlug", `${sellerId}--${sellerSlug}`));
          }
        }
      }

      setIsEditing?.(false);
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    sellerId, sellerSlug, openErrorModal, navigate, isUpToDateRate,
    deliverySpeedRate, serviceQualityRate, files, user.user?.id,
    comment, filesFromComment, isEditCommentForm, setIsEditing, sellerFeedbacksFetching
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

  let starSize = 16;
  let isWithStarText = false;

  if (isEditCommentForm) {
    starSize = 20;

    if (windowWidth >= 520) {
      starSize = 40;
      isWithStarText = true;
    } else if (windowWidth >= 500) {
      starSize = 32;
      isWithStarText = true;
    } else if (windowWidth >= 380) {
      starSize = 32;
    } else if (windowWidth >= 320) {
      starSize = 24;
    } 
  } else {
    starSize = 24

    if (windowWidth >= 480) {
      starSize = 40;
      isWithStarText = true;
    } else if (windowWidth >= 380) {
      starSize = 32;
      isWithStarText = true;
    }
  }

  const isUpToDateParaId = "write-seller-feedback-is-up-to-date-p";
  const deliverySpeedParaId = "write-seller-feedback-delivery-speed-p";
  const serviceQualityParaId = "write-seller-feedback-service-quality-p";

  const submitButton = (
    <UIButton
      type="submit"
      className="write-seller-feedback-submit-btn"
      isLoading={isSubmitting}
      disabled={areErrors}
      ref={submitBtnRef}
    >
      Send the rate
    </UIButton>
  );

  return (
    <form className="write-seller-feedback-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="write-seller-feedback-form-items">
        <div className="write-seller-feedback-star-rating-wrap">
          <div>
            <p id={isUpToDateParaId}>Is up to date</p>
            <StarRating
              id="write-seller-feedback-is-up-to-date-rate"
              size={starSize}
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
              size={starSize}
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
              size={starSize}
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
      {isEditCommentForm
        ? (
          <div className="write-seller-feedback-btn-group">
            <UIButton 
              className="write-seller-feedback-deny-btn" 
              variant="modal-deny" 
              onClick={() => setIsEditing?.(false)}
            >
              Deny
            </UIButton>
            {submitButton}
          </div>
        )
        : submitButton
      }
    </form>
  );
});

export default WriteSellerFeedbackForm;