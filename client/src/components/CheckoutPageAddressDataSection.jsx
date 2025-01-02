import "./styles/CheckoutPageAddressDataSection.css";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import isPhoneValidFn from "../utils/isPhoneValid";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import UserLocationBtn from "./UserLocationBtn";
import { v4 } from "uuid";
import { useMemo, useRef } from "react";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS } from "../utils/consts";
import MessageToUser from "./UI/messageToUser/MessageToUser";
import { onEmailInputChange, REQUIRED_EMAIL_INPUT_OPTIONS, REQUIRED_TEXT_INPUT_OPTIONS } from "../utils/inputOptionsConsts";

const POSSIBLE_TYPES = ["sender", "receivent"];

// orderId is used for receivent type of the section
// there can't be more than one address data sections of the same type at the same time
const CheckoutPageAddressDataSection = ({
  register, errors, trigger, isPhoneInputDirty, setIsPhoneInputDirty,
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  type = "sender", orderId = null,
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CheckoutPageAddressDataSection is incorrect");
  const isValidEmail = useRef(true);

  const phoneNumberInputId = useMemo(() => 
    "checkout-phone-number-" + ((orderId !== null && orderId !== undefined) ? orderId : v4()), 
  [orderId]);

  if (type === "receivent" && orderId === null && orderId !== undefined) return;

  function onPhoneInputChange(value) {
    setPhoneInputValue(value);
  }

  const isPhoneValid = isPhoneValidFn(phoneInputValue);

  let heading = "";
  let firstNameFieldName;
  let secondNameFieldName;

  if (type === "sender") {
    heading = "Sender data";
    firstNameFieldName = "senderFirstName";
    secondNameFieldName = "senderSecondName";
  } else if (type === "receivent") {
    heading = "Receivent data";
    firstNameFieldName = "receiventFirstName-" + ((orderId !== null && orderId !== undefined) ? orderId : v4());
    secondNameFieldName = "receiventSecondName-" + ((orderId !== null && orderId !== undefined) ? orderId : v4());
  }

  // doing this to prevent focusing email (patronymic) input while there are first and second names' inputs' errors 
  const firstNameRegisterResult = register(firstNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);
  const secondNameRegisterResult = register(secondNameFieldName, REQUIRED_TEXT_INPUT_OPTIONS);

  const receiventPatronymicFieldName = "receiventPatronymic-" + ((orderId !== null && orderId !== undefined) ? orderId : v4());

  let emailInputRegisterResult;
  let emailInputFieldName;
  let patronymicRegisterResult;

  if (type === "sender") {
    // { ref: registeredEmailRef, ...restEmailInfo }
    emailInputFieldName = "senderEmail";

    emailInputRegisterResult = register(emailInputFieldName, {
      ...REQUIRED_EMAIL_INPUT_OPTIONS,
      onChange: (e) => onEmailInputChange(e, isValidEmail, trigger, emailInputFieldName)
    });
  } else if (type === "receivent") {
    patronymicRegisterResult = register(
      receiventPatronymicFieldName, REQUIRED_TEXT_INPUT_OPTIONS
    );
  }

  let headerContent = "";
  if (type === "sender") {
    headerContent = <h3>{heading}</h3>;
  } else if (type === "receivent") {
    headerContent = <h4>{heading}</h4>;
  }

  return (
    <section className="checkout-page-address-data-section">
      {headerContent}
      <div>
        <div className="checkout-address-data-section-inputs">
          <ReactHookFormInput
            labelText="First name"
            inputName={firstNameFieldName}
            errors={errors}
            registerFnResult={firstNameRegisterResult}
            className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
          />
          <ReactHookFormInput
            labelText="Second name"
            inputName={secondNameFieldName}
            errors={errors}
            registerFnResult={secondNameRegisterResult}
            className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
          />
          {(type === "sender" && emailInputRegisterResult) &&
            <ReactHookFormInput
              labelText="Email"
              inputName={emailInputFieldName}
              errors={errors}
              autoComplete="on"
              registerFnResult={emailInputRegisterResult}
              className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
            />
          }
          {(type === "receivent" && patronymicRegisterResult) &&
            <ReactHookFormInput
              labelText="Patronymic"
              inputName={receiventPatronymicFieldName}
              errors={errors}
              registerFnResult={patronymicRegisterResult}
              className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
            />
          }
          <div className="react-hook-form-input">
            <label htmlFor={phoneNumberInputId}>
              Phone number
              <CustomPhoneInput
                defaultCountry="ua"
                value={phoneInputValue}
                onChange={onPhoneInputChange}
                onFocus={() => setIsPhoneInputDirty(true)}
                id={phoneNumberInputId}
                isInvalid={isPhoneInputDirty && !isPhoneValid}
                className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
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
        {type === "sender" &&
          <UserLocationBtn className="sender-section-version" type="button" />
        }
        {type === "receivent" &&
          <MessageToUser 
            messageText="
              Please note that the order will be received by passport.
              Enter first name, second name, patronymic as indicated in the document and
              the mobile phone number of the order receivent"
            className="checkout-page-receivent-data-warning"
          />
        }
      </div>

    </section>
  );
}

export default CheckoutPageAddressDataSection;
