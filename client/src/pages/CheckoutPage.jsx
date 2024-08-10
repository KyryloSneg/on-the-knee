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

const CheckoutPage = observer(() => {
  // TODO: check are all devices available in such amount as user typed in or no,
  // (if the last one show message or modal window that say 
  // "Unfortunately, there's no such amount of the next devices you've tried to order now: 
  // {list of { component with device img, device name, user amount, current available amount }}
  // do you want to order ones in current available amounts?" or smth like that) 

  const { app, user } = useContext(Context);
  const navigate = useNavigateToEncodedURL();
  const phoneNumberInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [isPhoneInputDirty, setIsPhoneInputDirty] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState("");

  // TODO: auto-fill sender data inputs with user data if he / she logged in
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
  } = useForm({
    mode: "onBlur"
  });

  useGettingCartData(user.cart?.id, null, true, true, true);
  useEffect(() => {
    app.setSelectedDeliveryId(app.deliveries[0]?.id);
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

  function checkIsPhoneNumberInputValid() {
    const isPhoneNumberValid = isPhoneValidFn(phoneInputValue);
    if (!isPhoneNumberValid) {
      // setting the dirty state to true to show the error if we have one
      setIsPhoneInputDirty(true);

      if (!Object.keys(errors).length) {
        phoneNumberInputRef.current?.focus();
      };

      return;
    };

    return isPhoneNumberValid;
  }

  function onSubmit() {
    if (!checkIsPhoneNumberInputValid()) return;
  }

  return (
    <div className="checkout-page">
      <header>
        <h2>Checkout order</h2>
      </header>
      <form onSubmit={handleSubmit(onSubmit, checkIsPhoneNumberInputValid)}>
        <CheckoutPageMainContent
          register={register}
          errors={errors}
          trigger={trigger}
          isPhoneInputDirty={isPhoneInputDirty}
          setIsPhoneInputDirty={setIsPhoneInputDirty}
          phoneInputValue={phoneInputValue}
          setPhoneInputValue={setPhoneInputValue}
          phoneNumberInputRef={phoneNumberInputRef}
          emailInputRef={emailInputRef}
        />
        <CheckoutPageAside />
      </form>
    </div>
  );
});

export default CheckoutPage;
