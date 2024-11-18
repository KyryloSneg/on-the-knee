import "./styles/CheckoutPage.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import useGettingCartData from "../hooks/useGettingCartData";
import { Context } from "../Context";
import _ from "lodash";
import useNavigateToEncodedURL from "../hooks/useNavigateToEncodedURL";
import { observer } from "mobx-react-lite";
import CheckoutPageMainContent from "../components/CheckoutPageMainContent";
import CheckoutPageAside from "../components/CheckoutPageAside";
import { useForm } from "react-hook-form";
import isPhoneValidFn from "../utils/isPhoneValid";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS, ROOT_ROUTE } from "../utils/consts";
import useGettingOrders from "../hooks/useGettingOrders";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";
import { v4 } from "uuid";
import CartComboActions from "../utils/CartComboActions";
import { getOneDeviceSaleDevices } from "../http/SalesAPI";
import StringActions from "../utils/StringActions";
import { parsePhoneNumber } from "libphonenumber-js";
import { createOrder, createOrderCourierDelivery, createOrderDeviceCombination, createOrderSelectedAdditionalServices, createReceivent } from "../http/OrderAPI";
import { deleteCartDeviceCombination, patchCartSelectedAdditionalServices } from "../http/CartAPI";
import { getOneStock, patchStock } from "../http/StocksAPI";
import { getDeviceCombination } from "../http/DeviceApi";
import setCartModalVisibility from "../utils/setCartModalVisibility";
import setWrongCartComboAmountsModalVisibility from "../utils/setWrongCartComboAmountsVisibility";
import useLodashThrottle from "hooks/useLodashThrottle";

const CheckoutPage = observer(() => {
  const { app, deviceStore, user } = useContext(Context);
  const navigate = useNavigateToEncodedURL();
  const senderPhoneNumberInputRef = useRef(null);
  const isAlreadySubmittingRef = useRef(false);

  const [isSenderPhoneInputDirty, setIsSenderPhoneInputDirty] = useState(false);
  const [senderPhoneInputValue, setSenderPhoneInputValue] = useState(user.userAddress?.phoneNumber?.replaceAll(" ", "") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orders = useGettingOrders();

  // auto-fill sender data inputs with user data if he / she logged in
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
      "senderFirstName": user.user?.name || "",
      "senderSecondName": user.user?.surname || "",
      "senderEmail": user.userAddress?.email || "",
      // the delivery-section-related fields have names that are randomly generated
      // (we can't include them here)

      // the receivent-related fields' names are generated on their render and we can't include them here once again
    }
  });

  const fetching = useGettingCartData(user.cart?.id, null, true, true);
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
  ) || !Object.keys(user.cartSelectedAdditionalServices)?.length || !deviceStore.hasTriedToFetchSales;

  const submitCallback = useCallback(async value => {
    try {
      if (isAlreadySubmittingRef.current) return;
      isAlreadySubmittingRef.current = true;

      setIsSubmitting(true);

      for (let cartCombo of user.cartDeviceCombinations) {
        const totalStockToUse = cartCombo.device.isPreOrder
          ? cartCombo["device-combination"].maxPreOrderAmount
          : await getOneStock(cartCombo["device-combination"].stockId);

        if (cartCombo.amount > totalStockToUse.totalStock || totalStockToUse.totalStock === 0) {
          // closing the cart modal because user can open it while submitting and 
          // end up with the wrong cart combo amounts modal eventually
          // (this can make the updateCartData function to not work properly) 
          setCartModalVisibility(false, app);
          setWrongCartComboAmountsModalVisibility(true, app);

          return;
        }
      }

      // { 
      //   order: {...}, 
      //   receivent: {...}, 
      //   orderCourierDelivery: {...} || null, 
      //   orderDeviceCombinations: [...] 
      //   orderSelectedAdditionalServices: {...}
      // }
      let ordersToPost = [];

      for (let [id, order] of Object.entries(orders)) {
        let orderResult = {};
        let receiventResult = {};
        let orderCourierDeliveryResult = null;
        let orderDeviceCombinationsResult = [];

        orderResult.id = v4();
        orderResult.orderTypes = order.types;

        let orderSelectedAdditionalServicesResult = {
          "id": v4(),
          "orderId": orderResult.id,
          "selected-additional-services": {}
        };

        if (user.isAuth && (user.user?.id !== null && user.user?.id !== undefined)) {
          orderResult.userId = user.user.id;
        } else {
          orderResult.userId = null;
          orderResult.name = StringActions.removeRedundantSpaces(value.senderFirstName);
          orderResult.surname = StringActions.removeRedundantSpaces(value.senderSecondName);
          orderResult.email = StringActions.removeRedundantSpaces(value.senderEmail);
          // we save our phone number the same way as we do on the server (the international format)
          orderResult.phoneNumber = parsePhoneNumber(senderPhoneInputValue).formatInternational();
        }

        // saving current saleDevices to save sales atm of submitting the form by user
        let saleDevices = [];
        let additionalServicesPrice = 0;

        for (let cartCombo of order.value) {
          const orderDeviceCombo = {
            "id": v4(),
            "orderId": orderResult.id,
            "deviceId": cartCombo.deviceId,
            "device-combinationId": cartCombo["device-combinationId"],
            "amount": cartCombo.amount,
            "isPreOrder": cartCombo.device.isPreOrder
          };

          const orderComboSelectedAddServices = 
            user.cartSelectedAdditionalServices["selected-additional-services"][cartCombo.id] || [];

          orderSelectedAdditionalServicesResult["selected-additional-services"][orderDeviceCombo.id] = 
            orderComboSelectedAddServices;

          for (let addService of orderComboSelectedAddServices) {
            additionalServicesPrice += +addService.price;
          }

          orderDeviceCombinationsResult.push(orderDeviceCombo);
          saleDevices.push(await getOneDeviceSaleDevices(cartCombo.device.id));
        }

        const { deviceAmount, devicePrice } = CartComboActions.getDeviceAmountAndTotalPrice(
          order.value, deviceStore.sales, deviceStore.saleTypeNames, deviceStore.hasTriedToFetchSales
        );

        const deliveryPrice = CartComboActions.getDeliveryTotalPrice(
          orders, app.selectedDeliveryIdValues, app.deliveries, app.isToLiftOnTheFloorValues
        );

        orderResult.devicePrice = devicePrice.toFixed(2);
        orderResult.additionalServicesPrice = additionalServicesPrice.toFixed(2);
        orderResult.deliveryPrice = deliveryPrice.toFixed(2);
        orderResult.totalPrice = (devicePrice + deliveryPrice + additionalServicesPrice).toFixed(2);

        orderResult.totalDeviceAmount = deviceAmount;
        orderResult.status = "Pending";
        // order's name is just a random number as i understood
        let orderName = Math.random().toString().slice(2, 12);
        orderName = `${orderName.slice(0, 3)} ${orderName.slice(3, 6)} ${orderName.slice(6)}`;

        orderResult.orderName = orderName;
        orderResult.date = new Date().toISOString();
        // BOL number, the same as before
        let info = Math.random().toString().slice(2, 12);
        info = `${info.slice(0, 3)} ${info.slice(3, 6)} ${info.slice(6)}`;

        orderResult.info = info;

        receiventResult.id = v4();
        receiventResult.name = StringActions.removeRedundantSpaces(value[`receiventFirstName-${id}`]);
        receiventResult.surname = StringActions.removeRedundantSpaces(value[`receiventSecondName-${id}`]);
        receiventResult.patronymic = StringActions.removeRedundantSpaces(value[`receiventPatronymic-${id}`]);
        receiventResult.phoneNumber = parsePhoneNumber(app.receiventPhoneInputsValues[id].value).formatInternational();

        const selectedDeliveryIdValue = app.selectedDeliveryIdValues[id].value;
        const selectedDelivery = app.deliveries.find(delivery => delivery.id === selectedDeliveryIdValue);

        if (selectedDelivery.name === "courier") {
          orderCourierDeliveryResult = {};
          orderCourierDeliveryResult.id = v4();
          orderCourierDeliveryResult.orderId = orderResult.id;
          orderCourierDeliveryResult.deliveryId = selectedDelivery.id;

          orderCourierDeliveryResult["courier-scheduleId"] = app.selectedCourierScheduleIdValues[id].value;
          orderCourierDeliveryResult.courierShift = app.selectedCourierScheduleShiftValues[id].value;

          orderCourierDeliveryResult.street = StringActions.removeRedundantSpaces(value[`street-${id}`]);
          orderCourierDeliveryResult.houseNumber = StringActions.removeRedundantSpaces(value[`houseNumber-${id}`]);

          const flatNumber = value[`flatNumber-${id}`].replaceAll(" ", "");
          const floor = value[`floor-${id}`].replaceAll(" ", "");

          orderCourierDeliveryResult.flatNumber = !!flatNumber.length ? flatNumber : null;
          orderCourierDeliveryResult.floor = !!floor.length ? floor : null;

          orderCourierDeliveryResult.toLiftOnTheFloor = app.isToLiftOnTheFloorValues[id].value;
        }

        orderResult["receiventId"] = receiventResult.id;
        orderResult["store-pickup-pointId"] = app.selectedStorePickupPointIdValues[id].value;
        orderResult["order-courier-deliveryId"] = orderCourierDeliveryResult?.id || null;

        orderResult.saleDevices = saleDevices;

        const result = {
          order: orderResult,
          receivent: receiventResult,
          orderCourierDelivery: orderCourierDeliveryResult,
          orderDeviceCombinations: orderDeviceCombinationsResult,
          orderSelectedAdditionalServices: orderSelectedAdditionalServicesResult
        };

        ordersToPost.push(result);
      }

      // create orders on the server only if EVERY single order succesfully was added from the loop above 
      for (let result of ordersToPost) {
        await createOrder(result.order);
        await createReceivent(result.receivent);
        await createOrderCourierDelivery(result.orderCourierDelivery);

        for (let combo of result.orderDeviceCombinations) {
          await createOrderDeviceCombination(combo);

          if (!combo.isPreOrder) {
            const deviceCombination = await getDeviceCombination(combo["device-combinationId"]);
            const stock = deviceCombination.stock;

            const newTotalStock = (stock.totalStock - combo.amount) || 0;
            let stockStatus;

            if (newTotalStock === 0) {
              stockStatus = "Out of stock";
            } else if (newTotalStock <= 15) {
              stockStatus = "Is running out";
            } else {
              stockStatus = "In stock";
            }

            const newStockContent = {
              totalStock: newTotalStock,
              stockStatus,
            };

            await patchStock(stock.id, newStockContent)
          }
        }

        await createOrderSelectedAdditionalServices(result.orderSelectedAdditionalServices);
      }

      // clear the cart (this logic should NOT prevent navigating to the main page logic)
      try {
        if (user.isAuth) {
          await patchCartSelectedAdditionalServices(
            user.cartSelectedAdditionalServices.id,
            { "selected-additional-services": {} }
          );

          for (let cartCombo of user.cartDeviceCombinations) {
            try {
              await deleteCartDeviceCombination(cartCombo.id);
            } catch (e) {
              if (e.response.status !== 500) console.log(e.message);
            }
          }
        } else {
          const newCartSelectedAdditionalServices = {
            "id": null,
            "cartId": null,
            "selected-additional-services": {},
          };

          localStorage.setItem("cartDeviceCombinations", JSON.stringify([]));
          localStorage.setItem("cartSelectedAddServices", JSON.stringify(newCartSelectedAdditionalServices));
        }

        // do not forget to update userStore's states after changing data on the server / in localStorage
        await fetching(user.cart?.id, null, true);
      } catch (e) {
        console.log(e.message);
      }

      navigate(ROOT_ROUTE);
    } catch (e) {
      console.log(e.message);

      const errorModalInfoChildren = (
        <p className="error-modal-p">
          Submitting the form leaded to the error. Try a bit later
        </p>
      );
      app.setErrorModalInfo({ children: errorModalInfoChildren, id: "checkout-page-submit-error", className: "" });
      app.setErrorModalBtnRef(app.checkoutSubmitBtnRef);
      setErrorModalVisibility(true, app);
    } finally {
      isAlreadySubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [
    app, deviceStore.hasTriedToFetchSales, deviceStore.saleTypeNames, deviceStore.sales,
    fetching, navigate, orders, senderPhoneInputValue, user.cart?.id, user.cartDeviceCombinations,
    user.cartSelectedAdditionalServices, user.isAuth, user.user?.id
  ]);

  // using isAlreadySubmittingRef and a small delay to make not possible to submit the same order a couple times in a row 
  const throttledSubmitCallback = useLodashThrottle(submitCallback, 500, { "trailing": false });

  if (isLoadingContent) return <div />;
  if (!user.cartDeviceCombinations?.length) {
    // using timeout to prevent this error to appear:
    // https://stackoverflow.com/questions/62336340/cannot-update-a-component-while-rendering-a-different-component-warning
    setTimeout(() => navigate(ROOT_ROUTE, { replace: true }, 0));
  };

  function checkInputsValidAndHandleInvalidInputFocus(isErrorHandler, errorsFromHandler = null) {
    let areInputsValid = true;
    let arePhoneNumbersValid = true;
    let phoneNumberInputToFocus = null;

    setIsSenderPhoneInputDirty(true);
    if (!isPhoneValidFn(senderPhoneInputValue)) {
      arePhoneNumbersValid = false;
      areInputsValid = false;
      phoneNumberInputToFocus = senderPhoneNumberInputRef.current;
    }

    for (let [, phoneInput] of Object.entries(app.receiventPhoneInputsValues)) {
      if (!phoneInput) break;
      phoneInput?.setIsPhoneInputDirty?.(true);

      if (arePhoneNumbersValid && !phoneNumberInputToFocus) {
        const isValid = isPhoneValidFn(phoneInput?.value);
        if (!isValid) {
          arePhoneNumbersValid = false;
          areInputsValid = false;
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
        areInputsValid = false;
        break;
        // if the current input is a phone number one !!errorsFromHandler?.[input?.name] is false
        // because errorsFromHandler includes only errors from the registered inputs
      } else if (isErrorHandler && errorsFromHandler?.[input?.name]) {
        setFocus(input.name);
        areInputsValid = false;
        break;
      } else if (phoneNumberInputToFocus?.isEqualNode(input)) {
        // focus the invalid phone input only if it's located before invalid registered inputs
        phoneNumberInputToFocus?.focus();
        areInputsValid = false;
        break;
      }
    }

    return areInputsValid;
  }

  async function onSubmit(value) {
    if (!checkInputsValidAndHandleInvalidInputFocus(false)) return;

    throttledSubmitCallback(value);
  }

  // disabling enter key in the form
  function onFormKeyDown(e) {
    if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") {
      return;
    }

    e.preventDefault()
  }

  return (
    <>
      <div className="checkout-page">
        <header>
          <h2>Checkout order</h2>
        </header>
        <form
          onSubmit={handleSubmit(
            onSubmit, (errors) => checkInputsValidAndHandleInvalidInputFocus(true, errors))
          }
          onKeyDown={onFormKeyDown}
        >
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
          <CheckoutPageAside isSubmitting={isSubmitting} />
        </form>
      </div>
      {/* <DevTool control={control} /> */}
    </>
  );
});

export default CheckoutPage;
