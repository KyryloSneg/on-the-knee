import "./styles/CheckoutPageAddressDataSection.css";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import isPhoneValidFn from "../utils/isPhoneValid";
import isEmailValidFn from "../utils/isEmailValid";
import CustomPhoneInput from "./UI/customPhoneInput/CustomPhoneInput";
import UserLocationBtn from "./UserLocationBtn";
import { v4 } from "uuid";
import { useMemo } from "react";

const POSSIBLE_TYPES = ["sender", "receivent"];

// orderId is used for receivent type of the section
// there can't be more than one address data sections of the same type at the same time
const CheckoutPageAddressDataSection = ({
  register, errors, trigger, isPhoneInputDirty, setIsPhoneInputDirty,
  phoneInputValue, setPhoneInputValue, phoneNumberInputRef,
  type = "sender", orderId = null,
}) => {
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of CheckoutPageAddressDataSection is incorrect");

  const phoneNumberInputId = useMemo(() => "checkout-phone-number-" + (orderId || v4()), [orderId]);
  if (type === "receivent" && orderId === null) return <div />;

  const baseOptions = {
    validate: {
      isRequired: value => !!value.trim().length || "Required field",
      isAppropriateLength: (
        value => value.trim().length <= 1000 || "This field must contain less than or equal to 1000 characters"
      )
    }
  };

  const textInputOptions = {
    ...baseOptions,
    validate: {
      ...baseOptions.validate.isRequired,
      isOnlyLetters: value => {
        // do not forget that our regex doesn't detect whitespaces, so matches.length might be less than value.length.
        // to prevent that, delete all whitespaces from the value
        const valueWithoutSpaces = value.split("").filter(char => char !== " ").join("");
        const matches = valueWithoutSpaces.match(/\p{Letter}/gu);

        const isOnlyLetters = matches?.length === valueWithoutSpaces.length;
        return isOnlyLetters || "Letters only";
      },
      ...baseOptions.validate,
    }
  }

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
    firstNameFieldName = "receiventFirstName-" + orderId;
    secondNameFieldName = "receiventSecondName-" + orderId;
  }

  // doing this to prevent focusing email (patronymic) input while there are first and second names' inputs' errors 
  const firstNameRegisterResult = register(firstNameFieldName, textInputOptions);
  const secondNameRegisterResult = register(secondNameFieldName, textInputOptions);

  const receiventPatronymicFieldName = "receiventPatronymic-" + orderId;

  let emailInputRegisterResult;
  let patronymicRegisterResult;

  if (type === "sender") {
    // { ref: registeredEmailRef, ...restEmailInfo }
    emailInputRegisterResult = register("senderEmail", {
      ...baseOptions,
      validate: {
        ...baseOptions.validate,
        isValidEmail: value => isEmailValidFn(value) || "Incorrect email"
      },
      onChange: () => {
        // manually triggering validation fn like it was with "onChange" mode
        trigger("senderEmail");
      }
    });

  } else if (type === "receivent") {
    patronymicRegisterResult = register(
      receiventPatronymicFieldName, textInputOptions
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
      <header>
        {headerContent}
      </header>
      <div>
        <div className="checkout-address-data-section-inputs">
          <ReactHookFormInput
            labelText="First name"
            inputName={firstNameFieldName}
            errors={errors}
            registerFnResult={firstNameRegisterResult}
          />
          <ReactHookFormInput
            labelText="Second name"
            inputName={secondNameFieldName}
            errors={errors}
            registerFnResult={secondNameRegisterResult}
          />
          {(type === "sender" && emailInputRegisterResult) &&
            <ReactHookFormInput
              labelText="Email"
              inputName="senderEmail"
              errors={errors}
              autoComplete="on"
              registerFnResult={emailInputRegisterResult}
            />
          }
          {(type === "receivent" && patronymicRegisterResult) &&
            <ReactHookFormInput
              labelText="Patronymic"
              inputName={receiventPatronymicFieldName}
              errors={errors}
              registerFnResult={patronymicRegisterResult}
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
          <div className="checkout-page-receivent-data-warning">
            <p>
              Please note that the order will be received by passport.
              Enter first name, second name, patronymic as indicated in the document and
              the mobile phone number of the order receivent
            </p>
          </div>
        }
      </div>

    </section>
  );
}

export default CheckoutPageAddressDataSection;
