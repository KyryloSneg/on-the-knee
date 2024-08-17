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
import useSettingInitialSelectedScheduleId from "../hooks/useSettingInitialSelectedScheduleId";

const CheckoutPage = observer(() => {
  // TODO: check are all devices available in such amount as user typed in or no,
  // (if the last one show message or modal window that say 
  // "Unfortunately, there's no such amount of the next devices you've tried to order now: 
  // {list of { component with device img, device name, user amount, current available amount }}
  // do you want to order ones in current available amounts?" or smth like that) 

  const { app, user } = useContext(Context);
  const navigate = useNavigateToEncodedURL();
  const senderPhoneNumberInputRef = useRef(null);
  const receiventPhoneNumberInputRef = useRef(null);

  const [isSenderPhoneInputDirty, setIsSenderPhoneInputDirty] = useState(false);
  const [senderPhoneInputValue, setSenderPhoneInputValue] = useState("");

  const [isReceiventPhoneInputDirty, setIsReceiventPhoneInputDirty] = useState(false);
  const [receiventPhoneInputValue, setReceiventPhoneInputValue] = useState("");

  const [hasElevator, setHasElevator] = useState(null);
  const [isToLiftOnTheFloor, setIsToLiftOnTheFloor] = useState(false);
  const [selectedCourierScheduleId, setSelectedCourierScheduleId] = useState(null);
  const [selectedCourierScheduleShift, setSelectedCourierScheduleShift] = useState(null);

  // TODO: auto-fill sender data inputs with user data if he / she logged in
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      "senderFirstName": "",
      "senderSecondName": "",
      "senderEmail": "",
      "street": "",
      "houseNumber": "",
      "flatNumber": "",
      "floor": "",
      "receiventFirstName": "",
      "receiventSecondName": "",
      "receiventPatronymic": "",
    }
  });

  useGettingCartData(user.cart?.id, null, true, true, true);
  useEffect(() => {
    app.setSelectedDeliveryId(app.deliveries[0]?.id);
  }, [app, app.deliveries]);
  useSettingInitialSelectedScheduleId(setSelectedCourierScheduleId, setSelectedCourierScheduleShift);

  const isLoadingContent = (
    (user.isAuth && !_.isEqual(user.user, {})) && _.isEqual(user.cart, {})
  ) || !Object.keys(user.cartSelectedAdditionalServices)?.length;

  if (isLoadingContent) return <div />;
  if (!user.cartDeviceCombinations?.length) {
    // using timeout to prevent this error to appear:
    // https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    setTimeout(() => navigate("/", { replace: true }, 0));
  };

  function checkIsPhoneNumberInputValid(type) {
    let isPhoneNumberValid = isPhoneValidFn(senderPhoneInputValue);

    if (type === "sender") {
      if (!isPhoneNumberValid) {
        // setting the dirty state to true to show the error if we have one
        setIsSenderPhoneInputDirty(true);
  
        if (!Object.keys(errors).length) {
          senderPhoneNumberInputRef.current?.focus();
        };
      };
    } else if (type === "receivent") {
      if (!isPhoneNumberValid) {
        setIsReceiventPhoneInputDirty(true);
  
        if (!Object.keys(errors).length) {
          receiventPhoneNumberInputRef.current?.focus();
        };
      };
    }

    return isPhoneNumberValid;
  }

  function onSubmit() {
    // sender phone number input must be focused first, not receivent one,
    // so check sender phone number validity last
    if (!checkIsPhoneNumberInputValid("receivent") || !checkIsPhoneNumberInputValid("sender")) return;
    console.log(hasElevator);
  }

  return (
    <>
      <div className="checkout-page">
        <header>
          <h2>Checkout order</h2>
        </header>
        <form onSubmit={handleSubmit(onSubmit, checkIsPhoneNumberInputValid)}>
          <CheckoutPageMainContent
            register={register}
            // i fucking hate this (errors obj was changing but it didn't lead to child's re-renders),
            // so do it by ourselves (sorry app optimization)
            errors={{...errors}}
            watch={watch}
            trigger={trigger}
            isSenderPhoneInputDirty={isSenderPhoneInputDirty}
            setIsSenderPhoneInputDirty={setIsSenderPhoneInputDirty}
            senderPhoneInputValue={senderPhoneInputValue}
            setSenderPhoneInputValue={setSenderPhoneInputValue}
            senderPhoneNumberInputRef={senderPhoneNumberInputRef}
            isReceiventPhoneInputDirty={isReceiventPhoneInputDirty}
            setIsReceiventPhoneInputDirty={setIsReceiventPhoneInputDirty}
            receiventPhoneInputValue={receiventPhoneInputValue}
            setReceiventPhoneInputValue={setReceiventPhoneInputValue}
            receiventPhoneNumberInputRef={receiventPhoneNumberInputRef}
            hasElevator={hasElevator}
            setHasElevator={setHasElevator}
            isToLiftOnTheFloor={isToLiftOnTheFloor}
            setIsToLiftOnTheFloor={setIsToLiftOnTheFloor}
            selectedCourierScheduleId={selectedCourierScheduleId}
            setSelectedCourierScheduleId={setSelectedCourierScheduleId}
            selectedCourierScheduleShift={selectedCourierScheduleShift}
            setSelectedCourierScheduleShift={setSelectedCourierScheduleShift}
          />
          <CheckoutPageAside />
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </>
  );
});

export default CheckoutPage;
