import "./styles/UserChangePasswordForm.css";
import ServerErrorMsg from "./ServerErrorMsg";
import UIButton from "./UI/uiButton/UIButton";
import { CHANGE_PASSWORD_MODAL_SUBMIT_BTN_SERVICE_CLASS } from "utils/consts";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";
import PasswordInputSection from "./UI/passwordInputSection/PasswordInputSection";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { Context } from "Context";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import useLodashThrottle from "hooks/useLodashThrottle";
import getPasswordInputFieldName from "utils/getPasswordInputFieldName";
import { AxiosError } from "axios";

const UserChangePasswordForm = observer(({ closeModal }) => {
  const { user, app } = useContext(Context);

  const isAlreadySubmittingRef = useRef(null);
  const [possibleError, setPossibleError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    control,
    getValues,
    watch
  } = useForm({
    mode: "onBlur",
    shouldFocusError: false,
  });

  const prevIsNewPasswordEqualsToCurrentPassword = useRef(false);

  const uniqueCurrentInputVariantName = "change-password-modal-current";
  const uniqueNewInputVariantName = "change-password-modal-new";

  const currentPasswordInputFieldName = getPasswordInputFieldName(uniqueCurrentInputVariantName);
  const newPasswordInputFieldName = getPasswordInputFieldName(uniqueNewInputVariantName);

  const formFields = watch();

  const areNewPasswordTheSame = formFields?.[currentPasswordInputFieldName] === formFields?.[newPasswordInputFieldName];
  const areErrors = !!Object.keys(errors).length || areNewPasswordTheSame;

  const openErrorModal = useCallback(() => {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, changing password has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "changing-password-submit-error", className: "" });
    app.setErrorModalBtnRef({ current: document.querySelector(`.${CHANGE_PASSWORD_MODAL_SUBMIT_BTN_SERVICE_CLASS}`) || null });
    app.setIsToFocusErrorModalPrevModalTriggerElem(false);

    setErrorModalVisibility(true, app);
  }, [app]);

  const submitCallback = useCallback(async (formValues) => {
    let callbackPossibleError = null;

    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsLoading(true);

      const currentPassword = formValues[currentPasswordInputFieldName];
      const newPassword = formValues[newPasswordInputFieldName];

      callbackPossibleError = await user.changePassword(currentPassword, newPassword);

      // if we get ERR_NETWORK from the server (it has crashed for example), open the error modal
      if (!callbackPossibleError?.response && callbackPossibleError?.code === AxiosError.ERR_NETWORK) {
        openErrorModal();
      } else if (!callbackPossibleError) {
        closeModal();
      }
    } catch (e) {
      openErrorModal();
    } finally {
      if (
        (callbackPossibleError?.response && callbackPossibleError?.code !== AxiosError.ERR_NETWORK) 
        || !callbackPossibleError
      ) {
        setPossibleError(callbackPossibleError);
      };

      isAlreadySubmittingRef.current = false;
      setIsLoading(false);
    }

  }, [
    user, isAlreadySubmittingRef, currentPasswordInputFieldName, 
    newPasswordInputFieldName, closeModal, openErrorModal
  ]);

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  function onSubmit(formValues) {
    if (!areErrors) throttledSubmitCallback(formValues);
  }

  const newPasswordMustNotBeEqualToValuesObj = useMemo(() => {
    let result = {};

    result[currentPasswordInputFieldName] = {
      errorMsgKey: "isNotEqualToCurrentPassword",
      validationFieldName: "isNotEqualToCurrentPassword",
    }

    result[user.userAddress?.email] = {
      errorMsgKey: "isNotEqualToEmail",
      validationFieldName: "isNotEqualToEmail",
    };

    return result;
  }, [currentPasswordInputFieldName, user.userAddress?.email]);

  const currentPasswordOnChangeCb = useCallback(inputValue => {
    const isNewPasswordEqualsToCurrentPassword = inputValue.replaceAll(" ", "") === getValues(newPasswordInputFieldName); 

    if (prevIsNewPasswordEqualsToCurrentPassword.current !== isNewPasswordEqualsToCurrentPassword) {
      trigger(newPasswordInputFieldName);
      prevIsNewPasswordEqualsToCurrentPassword.current = isNewPasswordEqualsToCurrentPassword;
    }
  }, [getValues, newPasswordInputFieldName, trigger]);

  return (
    <form
      className="change-password-content-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="change-password-content-form-inputs-wrap">
        <PasswordInputSection
          register={register}
          errors={errors}
          control={control}
          trigger={trigger}
          labelText="Current password"
          uniqueInputVariantName={uniqueCurrentInputVariantName}
          isWithValidityRules={false}
          onChangeCb={currentPasswordOnChangeCb}
        />
        <PasswordInputSection
          register={register}
          errors={errors}
          control={control}
          trigger={trigger}
          uniqueInputVariantName={uniqueNewInputVariantName}
          labelText="New password"
          isWithPasswordConfirmation={true}
          mustNotBeEqualToValuesObj={newPasswordMustNotBeEqualToValuesObj}
          getValues={getValues}
        />
      </div>
      {possibleError && <ServerErrorMsg error={possibleError} />}
      <div className="change-password-modal-btn-group">
        <UIButton variant="modal-deny" onClick={closeModal}>
          Deny
        </UIButton>
        <UIButton 
          variant="modal-submit" 
          type="submit" 
          disabled={areErrors} 
          className={CHANGE_PASSWORD_MODAL_SUBMIT_BTN_SERVICE_CLASS}
          isLoading={isLoading}
        >
          Submit
        </UIButton>
      </div>
    </form>
  );
});

export default UserChangePasswordForm;
