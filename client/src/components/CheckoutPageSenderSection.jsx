import "./styles/CheckoutPageSenderSection.css";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import isPhoneValidFn from "../utils/isPhoneValid";
import isEmailValidFn from "../utils/isEmailValid";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import UserLocationBtn from "./UserLocationBtn";

const CheckoutPageSenderSection = ({
  register, errors, trigger, isPhoneInputDirty, setIsPhoneInputDirty,
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  emailInputRef
}) => {
  const baseOptions = {
    validate: {
      isRequired: value => !!value.trim().length || "Required field",
      isAppropriateLength: (
        value => value.trim().length <= 1000 || "This field must contain less than or equal to 1000 characters"
      )
    }
  };

  const isPhoneValid = isPhoneValidFn(phoneInputValue);

  // doing this to prevent focusing email input while there are first and second names' inputs' errors 
  const firstNameRegisterResult = register("firstName", baseOptions);
  const secondNameRegisterResult = register("secondName", baseOptions);

  const { ref: registeredEmailRef, ...restEmailInfo } = register("email", {
    ...baseOptions,
    validate: {
      ...baseOptions.validate,
      isValidEmail: value => isEmailValidFn(value) || "Incorrect email"
    },
    onChange: () => {
      // manually triggering validation fn like it was with "onChange" mode
      trigger("email");
    }
  });

  const emailInputInfo = { ref: registeredEmailRef, restEmailInfo };

  return (
    <section className="checkout-page-sender-section">
      <header>
        <h3>Sender data</h3>
      </header>
      <div>
        <div className="checkout-sender-section-inputs">
          <ReactHookFormInput
            labelText="First name"
            inputName="firstName"
            errors={errors}
            registerFnResult={firstNameRegisterResult}
          />
          <ReactHookFormInput
            labelText="Second name"
            inputName="secondName"
            errors={errors}
            registerFnResult={secondNameRegisterResult}
          />
          <ReactHookFormInput
            labelText="Email"
            inputName="email"
            errors={errors}
            autoComplete="on"
            registerFnResult={restEmailInfo}
            ref={ref => {
              emailInputInfo.ref(ref);
              emailInputRef.current = ref;
            }}
          />
          <div className="react-hook-form-input">
            <label htmlFor="checkout-sender-phone-number">
              Phone number
              <CustomPhoneInput
                defaultCountry="ua"
                value={phoneInputValue}
                onChange={setPhoneInputValue}
                onFocus={() => setIsPhoneInputDirty(true)}
                id="checkout-sender-phone-number"
                isInvalid={isPhoneInputDirty && !isPhoneValid}
                ref={phoneNumberInputRef}
              />
            </label>
            {(isPhoneInputDirty && !isPhoneValid) &&
              <p className="react-hook-form-input-error-msg" aria-live="polite">
                Phone number is not valid
              </p>
            }
          </div>
        </div>
        <UserLocationBtn className="sender-section-version" type="button" />
      </div>
    </section>
  );
}

export default CheckoutPageSenderSection;
