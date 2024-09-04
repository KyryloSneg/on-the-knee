import "./styles/CheckoutPage.css";
import { useContext, useEffect, useRef, useState } from "react";
import useGettingCartData from "../hooks/useGettingCartData";
import { Context } from "../Context";
import _ from "lodash";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import { observer } from "mobx-react-lite";
import CheckoutPageMainContent from "../components/CheckoutPageMainContent";
import CheckoutPageAside from "../components/CheckoutPageAside";
import { useForm } from "react-hook-form";
import isPhoneValidFn from "../utils/isPhoneValid";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS } from "../utils/consts";

const CheckoutPage = observer(() => {
  // TODO: check are all devices available in such amount as user typed in or no,
  // (if the last one show message or modal window that say 
  // "Unfortunately, there's no such amount of the next devices you've tried to order now: 
  // {list of { component with device img, device name, user amount, current available amount }}
  // do you want to order ones in current available amounts?" or smth like that) 

  const { app, user } = useContext(Context);
  const navigate = useNavigateToEncodedURL();
  const senderPhoneNumberInputRef = useRef(null);

  const [isSenderPhoneInputDirty, setIsSenderPhoneInputDirty] = useState(false);
  const [senderPhoneInputValue, setSenderPhoneInputValue] = useState("");

  // TODO: auto-fill sender data inputs with user data if he / she logged in
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    setFocus,
    control
  } = useForm({
    mode: "onBlur",
    shouldFocusError: false,
    defaultValues: {
      "senderFirstName": "",
      "senderSecondName": "",
      "senderEmail": "",
      // the delivery-section-related fields have names that are randomly generated
      // (we can't include them here)

      // the receivent-related fields' names are generated on their render and we can't include them here once again
    }
  });

  const fetching = useGettingCartData(user.cart?.id, null, true, true, true);
  function getCartData() {
    fetching(user.cart?.id, null, true);
  }

  useEffect(() => {
    try {
      let nextDeliveryIdValues = _.cloneDeep(app.selectedDeliveryIdValues);;
      for (let key of Object.keys(nextDeliveryIdValues)) {
        if (nextDeliveryIdValues[key]) nextDeliveryIdValues[key].value = app.deliveries[0]?.id;
        if (nextDeliveryIdValues[key]) nextDeliveryIdValues[key].setter?.(app.deliveries[0]?.id);
      }

      app.setSelectedDeliveryIdValues(nextDeliveryIdValues);
    } finally {
      app.setIsToShowAsideDeliveryPrice(true);
    }
  }, [app, app.deliveries]);

  const isLoadingContent = (
    (user.isAuth && !_.isEqual(user.user, {})) && _.isEqual(user.cart, {})
  ) || !Object.keys(user.cartSelectedAdditionalServices)?.length;

  if (isLoadingContent) return <div />;
  if (!user.cartDeviceCombinations?.length) {
    // using timeout to prevent this error to appear:
    // https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    setTimeout(() => navigate("/", { replace: true }, 0));
  };

  function checkArePhoneNumberInputsValidAndHandleInvalidInputFocus(isErrorHandler, errorsFromHandler = null) {
    let arePhoneNumbersValid = true;
    let phoneNumberInputToFocus = null;

    setIsSenderPhoneInputDirty(true);
    if (!isPhoneValidFn(senderPhoneInputValue)) {
      arePhoneNumbersValid = false;
      phoneNumberInputToFocus = senderPhoneNumberInputRef.current;
    }

    for (let [, phoneInput] of Object.entries(app.receiventPhoneInputsValues)) {
      if (!phoneInput) break;
      phoneInput?.setIsPhoneInputDirty?.(true);

      if (arePhoneNumbersValid && !phoneNumberInputToFocus) {
        const isValid = isPhoneValidFn(phoneInput?.value);
        if (!isValid) {
          arePhoneNumbersValid = false;
          if (!phoneNumberInputToFocus) phoneNumberInputToFocus = phoneInput?.ref?.current;
        }
      }
    };

    // handling focusing the first invalid input (or a delivery section btn) by ourselves 
    // (because RHF sets focus for the input only after our manual focus, and so "overrides" it)
    const formInputs = Array.from(document.querySelectorAll(`.${CHECKOUT_PAGE_INPUT_SERVICE_CLASS}`));

    for (let input of formInputs) {
      // we can't store boolean values in element props (they're converted into the string type)
      if (input.dataset?.isinvaliddeliverysectionbtn === "true") {
        input?.focus();
        break;
      } else if (isErrorHandler && errorsFromHandler?.[input?.name]) {
        setFocus(input.name);
        break;
      } else if (phoneNumberInputToFocus?.isEqualNode(input)) {
        // focus the invalid phone input only if it's located before invalid registered inputs
        phoneNumberInputToFocus?.focus();
        break;
      }
    }

    return arePhoneNumbersValid;
  }

  function onSubmit() {
    if (!checkArePhoneNumberInputsValidAndHandleInvalidInputFocus(false)) return;
  }

  return (
    <>
      <div className="checkout-page">
        <header>
          <h2>Checkout order</h2>
        </header>
        <form onSubmit={handleSubmit(
          onSubmit, (errors) => checkArePhoneNumberInputsValidAndHandleInvalidInputFocus(true, errors))
        }>
          <CheckoutPageMainContent
            register={register}
            // i fucking hate this (errors obj was changing but it didn't lead to child's re-renders),
            // so do it by ourselves (sorry app optimization)
            errors={{ ...errors }}
            trigger={trigger}
            control={control}
            isSenderPhoneInputDirty={isSenderPhoneInputDirty}
            setIsSenderPhoneInputDirty={setIsSenderPhoneInputDirty}
            senderPhoneInputValue={senderPhoneInputValue}
            setSenderPhoneInputValue={setSenderPhoneInputValue}
            senderPhoneNumberInputRef={senderPhoneNumberInputRef}
            cartDataFetching={getCartData}
          />
          <CheckoutPageAside />
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </>
  );
});

export default CheckoutPage;
