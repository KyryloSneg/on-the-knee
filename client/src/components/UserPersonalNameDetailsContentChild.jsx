import { useContext, useRef, useState } from 'react';
import UIButton from "./UI/uiButton/UIButton";
import { useForm } from "react-hook-form";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { Context } from "Context";
import { observer } from "mobx-react-lite";
import { REQUIRED_TEXT_INPUT_OPTIONS } from "utils/inputOptionsConsts";
import setErrorModalVisibility from "utils/setErrorModalVisibility";
import { AxiosError } from "axios";
import useLodashThrottle from "hooks/useLodashThrottle";

const UserPersonalNameDetailsContentChild = observer(() => {
  const { app, user } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBtnRef = useRef(null);

  const firstNameFieldName = "firstName";
  const secondNameFieldName = "secondName";

  let defaultValues = {};
  defaultValues[firstNameFieldName] = user.user.name || "";
  defaultValues[secondNameFieldName] = user.user.surname || "";

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    mode: "onChange",
    defaultValues
  });

  const areErrorsInFormState = !!Object.keys(errors).length;

  const firstNameRegisterResult = register(firstNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);
  const secondNameRegisterResult = register(secondNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);

  function onDenyBtnClick() {
    setIsEditing(false);
  }

  function openErrorModal() {
    const errorModalInfoChildren = (
      <p className="error-modal-p">
        Unfortunately, changing name or surname has failed. Try a bit later
      </p>
    );

    app.setErrorModalInfo({ children: errorModalInfoChildren, id: "changing-name-surname-submit-error", className: "" });
    app.setErrorModalBtnRef(submitBtnRef);
    setErrorModalVisibility(true, app);
  }

  async function submitCallback(formValues) {
    setIsSubmitting(true);

    try {
      const firstName = formValues[firstNameFieldName];
      const secondName = formValues[secondNameFieldName];

      if (firstName !== user.user.name || secondName !== user.user.surname) {
        const callbackPossibleError = await user.changeNameSurname(firstName, secondName);
        // if we get ERR_NETWORK from the server (it has crashed for example), open the error modal
        if (!callbackPossibleError?.response && callbackPossibleError?.code === AxiosError.ERR_NETWORK) {
          openErrorModal();
        } else if (!callbackPossibleError) {
          setIsEditing(false);
        }
      }
    } catch (e) {
      openErrorModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });
  
  if (isEditing) {
    const areNamesDifferent = (
      watch(firstNameFieldName) !== user.user.name || watch(secondNameFieldName) !== user.user.surname
    );

    function onSubmit(formFields) {
      if (!areErrorsInFormState && areNamesDifferent) throttledSubmitCallback(formFields);
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="user-personal-content-child">
        <div className="user-personal-details-inputs">
          <ReactHookFormInput
            labelText="First name"
            inputName={firstNameFieldName}
            errors={errors}
            registerFnResult={firstNameRegisterResult}
            isDisabled={!isEditing}
          />
          <ReactHookFormInput
            labelText="Second name"
            inputName={secondNameFieldName}
            errors={errors}
            registerFnResult={secondNameRegisterResult}
            isDisabled={!isEditing}
          />
        </div>
        <div className="user-personal-data-edit-btns">
          <UIButton 
            variant="modal-submit" 
            type="submit" 
            children="Submit" 
            disabled={!areNamesDifferent || !!Object.keys(errors).length} 
            isLoading={isSubmitting}
            ref={submitBtnRef}
          />
          <UIButton variant="modal-deny" children="Deny" onClick={onDenyBtnClick} />
        </div>
      </form>
    );
  }

  return (
    <div className="user-personal-content-child">
      <dl className="user-personal-details-values">
        <div>
          <dt>
            First name
          </dt>
          <dd>
            {user.user.name}
          </dd>
        </div>
        <div>
          <dt>
            Second name
          </dt>
          <dd>
            {user.user.surname}
          </dd>
        </div>
      </dl>
      <UIButton children="Edit" onClick={() => setIsEditing(true)} />
    </div>
  );
});

export default UserPersonalNameDetailsContentChild;
