import "./styles/UserPersonalAddressesContentChild.css";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import UIButton from "./UI/uiButton/UIButton";
import { REQUIRED_EMAIL_INPUT_OPTIONS } from "utils/inputOptionsConsts";
import MessageToUser from "./UI/messageToUser/MessageToUser";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import isPhoneValidFn from "utils/isPhoneValid";
import { AxiosError } from "axios";
import useLodashThrottle from "hooks/useLodashThrottle";

const UserPersonalAddressesContentChild = observer(({ id }) => {
  const { app, user } = useContext(Context);
  const defaultPhoneValue = user.userAddress.phoneNumber || "";

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState(defaultPhoneValue);
  const [isPhoneInputDirty, setIsPhoneInputDirty] = useState(false);
  const isAlreadySubmittingRef = useRef(null);
  const submitBtnRef = useRef(null);

  const phoneInputId = `${id}-phone`;
  const isPhoneValid = isPhoneValidFn(phoneInputValue);

  const emailFieldName = "email";
  let defaultValues = {};

  const emailDefaultValue = user.userAddress.email || "";
  defaultValues[emailFieldName] = emailDefaultValue;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    mode: "onChange",
    defaultValues
  });

  const emailRegisterResult = register(emailFieldName, REQUIRED_EMAIL_INPUT_OPTIONS);
  const areErrorsInFormState = !!Object.keys(errors).length;

  useEffect(() => {
    if (isEditing) {
      setPhoneInputValue(defaultPhoneValue);
      setIsPhoneInputDirty(false);

      setValue(emailFieldName, emailDefaultValue);
    }
    // eslint-disable-next-line
  }, [isEditing, setValue]);

  function onDenyBtnClick() {
    setIsEditing(false);
  }

  function openErrorModal() {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, changing phone number or email has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "changing-phone-email-submit-error", className: "" });
    app.setErrorModalBtnRef(submitBtnRef);
    setErrorModalVisibility(true, app);
  }

  async function submitCallback(formValues) {
    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsSubmitting(true);

      let callbackPossibleError = null;
      let emailsToConfirm = null;
      let isToSetEmailsToConfirmOnSuccess = true;

      const email = formValues[emailFieldName];

      if (phoneInputValue.replaceAll(" ", "") !== user.userAddress.phoneNumber.replaceAll(" ", "")) {
        callbackPossibleError = await user.changePhoneNumber(phoneInputValue);
      }

      if (email !== user.userAddress.email) {
        const emailsToConfirmOrError = await user.changeEmail(email);

        if (Array.isArray(emailsToConfirmEmails)) {
          emailsToConfirm = emailsToConfirmOrError;
        } else {
          callbackPossibleError = emailsToConfirmOrError;
        }
      }
      
      // if we get ERR_NETWORK from the server (it has crashed for example), open the error modal
      if (!callbackPossibleError?.response && callbackPossibleError?.code === AxiosError.ERR_NETWORK) {
        isToSetEmailsToConfirmOnSuccess = false;
        openErrorModal();
      } else if (!callbackPossibleError) {
        setIsEditing(false);
      }

      if (isToSetEmailsToConfirmOnSuccess && emailsToConfirm) user.setUserEmailsToConfirm(emailsToConfirm);
    } catch (e) {
      openErrorModal();
    } finally {
      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  const emailsToConfirmEmails = user.userEmailsToConfirm?.map(item => item.email);
  const possibleNewEmail = emailsToConfirmEmails?.find(email => email !== user.userAddress.email);

  const notActivatedEmailsToConfirm = user.userEmailsToConfirm?.filter(item => !item.isConfirmed);
  const notActivatedEmailsToConfirmLength = notActivatedEmailsToConfirm?.length;
  const notActivatedEmailsToConfirmEmails = notActivatedEmailsToConfirm?.map(item => item.email);

  if (isEditing) {
    const areValuesDifferentFromInitial = (
      phoneInputValue.replaceAll(" ", "") !== user.userAddress.phoneNumber.replaceAll(" ", "")
      || watch(emailFieldName) !== user.userAddress.email
    );

    function onSubmit(formFields) {
      if (!areErrorsInFormState && areValuesDifferentFromInitial) throttledSubmitCallback(formFields);
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} id={id} className="user-personal-content-child">
        <div className="user-personal-details-inputs">
          <div className="react-hook-form-input">
            <label htmlFor={phoneInputId}>
              Phone number
              {/* hiding the dropdown because it somehow affects the flow of content with the position: absolute; rule */}
              <CustomPhoneInput
                defaultCountry="ua"
                value={phoneInputValue}
                onChange={value => setPhoneInputValue(value)}
                onFocus={() => setIsPhoneInputDirty(true)}
                id={phoneInputId}
                hideDropdown={true}
                isInvalid={isPhoneInputDirty && !isPhoneValid}
              />
            </label>
            {(isPhoneInputDirty && !isPhoneValid) &&
              <p className="react-hook-form-input-error-msg" aria-live="polite">
                Phone number is not valid
              </p>
            }
          </div>
          <div className="user-personal-details-email-input-wrap">
            <ReactHookFormInput
              labelText="Email"
              inputName={emailFieldName}
              errors={errors}
              registerFnResult={emailRegisterResult}
              isDisabled={!isEditing || !user.isEmailActivated}
            />
            {!user.isEmailActivated && <p>Activate email before its change</p>}
          </div>
        </div>
        <div className="user-personal-data-edit-btns">
          <UIButton
            variant="modal-submit"
            type="submit"
            children="Submit"
            disabled={!areValuesDifferentFromInitial || !isPhoneValid || !!Object.keys(errors).length}
            isLoading={isSubmitting}
            ref={submitBtnRef}
          />
          <UIButton variant="modal-deny" children="Deny" onClick={onDenyBtnClick} />
        </div>
      </form>
    );
  }

  return (
    <div className="user-personal-content-child" id={id}>
      <dl className="user-personal-details-values">
        <div>
          <dt>
            Phone number
          </dt>
          <dd>
            {user.userAddress.phoneNumber}
          </dd>
        </div>
        <div>
          <dt>
            Email
          </dt>
          <dd>
            {user.userAddress.email}
          </dd>
        </div>
      </dl>
      {!!notActivatedEmailsToConfirmLength && (
        <MessageToUser>
          <p className="user-personal-email-confirmation-msg">
            You have to confirm&nbsp;
            {notActivatedEmailsToConfirmLength > 1
              ? (
                <>
                  mails on<span>{` ${notActivatedEmailsToConfirmEmails[0]} `}</span>
                  and<span>{` ${notActivatedEmailsToConfirmEmails[1]} `}</span>
                </>
              )
              : <>a mail on <span>{` ${notActivatedEmailsToConfirmEmails[0]} `}</span></>
            }
            to confirm the email change to <span>{possibleNewEmail}</span>
          </p>
        </MessageToUser>
      )}
      <UIButton children="Edit" onClick={() => setIsEditing(true)} />
    </div>
  );
});

export default UserPersonalAddressesContentChild;
