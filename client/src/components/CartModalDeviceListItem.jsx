import "./styles/CartModalDeviceListItem.css";
import { Link } from "react-router-dom";
import DeviceItemPrice from "./DeviceItemPrice";
import DeviceSalesActions from "../utils/DeviceSalesActions";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import { DEVICE_ROUTE } from "../utils/consts";
import CartModalItemOptions from "./CartModalItemOptions";
import NumberInput from "./UI/numberInput/NumberInput";
import { getOneStock } from "../http/StocksAPI";
import useLodashDebounce from "../hooks/useLodashDebounce";
import addIcon from "../assets/add_24x24_7373FF.svg";
import removeIcon from "../assets/remove-minus_24x24_7373FF.svg";
import AdditionalServicesSection from "./AdditionalServicesSection";
import useGettingAddServicesRelatedData from "../hooks/useGettingAddServicesRelatedData";

// [] - no stock error
// [error] - stock error is rendered

// [] => [error] with 1200ms delay (using isPossibleToShowStockError state and debounce)
// [error] => [] with 1200ms delay (adding to the above ones isEnoughDevices STATE, not variable)
const CartModalDeviceListItem = observer(({ combination }) => {
  const { user, deviceStore } = useContext(Context);
  const [value, setValue] = useState(combination.amount);
  const initialAmount = useRef(combination.amount);
  const [isValid, setIsValid] = useState(true);
  const [stateStock, setStateStock] = useState(deviceStore.stocks.find(stock => stock.id === combination["device-combination"].stockId));
  const [isPossibleToShowStockError, setIsPossibleToShowStockError] = useState(true);
  const [isEnoughDevices, setIsEnoughDevices] = useState(value <= (combination["device-combination"]?.maxPreOrderAmount || stateStock?.totalStock));
  const [additionalServicesObj, setAdditionalServicesObj] = useState([]);

  let initSelectedItems = [];
  if (user.cartSelectedAdditionalServices["selected-additional-services"]) {
    initSelectedItems = user.cartSelectedAdditionalServices["selected-additional-services"][combination.id] || [];
  }
  const [selectedAddServices, setSelectedAddServices] = useState(initSelectedItems);

  const deviceRouteCombo = combination["device-combination"].combinationString || "default";
  const to = DEVICE_ROUTE + `${combination.device.id}--${deviceRouteCombo}`;

  const { discountPercentage } =
    DeviceSalesActions.getSaleTypesAndDiscount(combination.device, deviceStore.sales, deviceStore.saleTypeNames)
    || { discountPercentage: 0 };

  const updateStock = async () => {
    try {
      if (!combination.device.isPreOrder) {
        const fetchedStock = await getOneStock(stateStock?.id);
  
        // if totalStock has changed, update stock
        if (fetchedStock.totalStock !== stateStock?.totalStock) {
          setStateStock(fetchedStock);
        };
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      let nextIsEnoughDevices;
      const maxPreOrderAmount = combination["device-combination"].maxPreOrderAmount;

      if (combination.device.isPreOrder) {
        nextIsEnoughDevices = value <= maxPreOrderAmount;
        if (!nextIsEnoughDevices) setValue(+maxPreOrderAmount);
      } else {
        nextIsEnoughDevices = value <= stateStock?.totalStock;
        // auto-setting max possible amount
        if (!nextIsEnoughDevices) setValue(+stateStock?.totalStock);
      }

      setIsPossibleToShowStockError(true);
      setIsEnoughDevices(nextIsEnoughDevices);
    }
  };

  const debouncedUpdateStock = useLodashDebounce(updateStock, 1200);

  function onSetValueCb() {
    if (isEnoughDevices) setIsPossibleToShowStockError(false);
    debouncedUpdateStock();
  }

  function increment() {
    setValue((val) => +val + 1);
    onSetValueCb();
  }

  function decrement() {
    if (value > minInputValue) {
      setValue((val) => +val - 1);
      onSetValueCb();
    }
  }

  useGettingAddServicesRelatedData(combination.device, setAdditionalServicesObj);
  useEffect(() => {
    // if we validated amount got from the localstorage and changed it,
    // change it in the device list item which amount was changed 
    // to the validated one
    if (combination.amount !== initialAmount.current) setValue(combination.amount);
  }, [combination.amount]);

  useEffect(() => {
    // updating values
    let nextDeviceListItemsValues = {...deviceStore.deviceListItemsValues};
    const addServicesTotalPrice = selectedAddServices.reduce((acc, currValue) => acc + +currValue.price, 0);
    nextDeviceListItemsValues[combination.id] = { 
      value, 
      totalStock: combination["device-combination"]?.maxPreOrderAmount || stateStock?.totalStock,
      selectedAddServices,
      addServicesTotalPrice: addServicesTotalPrice,
    };

    deviceStore.setDeviceListItemsValues(nextDeviceListItemsValues);
  }, [deviceStore, combination, combination.id, value, stateStock?.totalStock, selectedAddServices]);

  const minInputValue = 1;

  const renderAmountErrorCondition = isPossibleToShowStockError && !isEnoughDevices;

  // if value is too big, show price of max device amount
  const price = (
    combination["device-combination"].price * (
      value > (combination["device-combination"]?.maxPreOrderAmount || stateStock?.totalStock) 
        ? (combination["device-combination"]?.maxPreOrderAmount || stateStock?.totalStock)
        : value
    )
  ).toFixed(2);

  return (
    <div 
      className="cart-modal-device-list-item" 
      data-comboid={combination.id} 
      data-amount={value} 
      data-totalstock={combination["device-combination"]?.maxPreOrderAmount || stateStock?.totalStock}
      data-selectedaddservices={JSON.stringify(selectedAddServices)}
    >
      <div className="cart-modal-list-item-main-row">
        <Link to={to} className="cart-modal-item-img-wrap">
          <img
            src={combination["device-combination"].images[0].src}
            alt=""
            draggable="false"
          />
        </Link>
        <Link to={to} className="link-colors">
          {combination.device.name} ({combination["device-combination"].sku})
        </Link>
        <CartModalItemOptions combination={combination} />
      </div>
      {renderAmountErrorCondition &&
        <div className="cart-modal-item-stock-error">
          <p>No such amount of devices</p>
        </div>
      }
      <div className="cart-modal-list-item-price-row">
        <div className="cart-modal-list-item-amount-wrap">
          <button onClick={decrement} className="link-colors">
            <img src={removeIcon} alt="Decrement" draggable="false" />
          </button>
          <NumberInput
            value={value}
            setValue={setValue}
            isValid={isValid}
            setIsValid={setIsValid}
            minValue={minInputValue}
            isToUseNegativeIntegers={false}
            isToUseFloatNumbers={false}
            onSetValueCb={onSetValueCb}
          />
          <button onClick={increment} className="link-colors">
            <img src={addIcon} alt="Increment" draggable="false" />
          </button>
        </div>
        <DeviceItemPrice
          price={price}
          discountPercentage={discountPercentage}
        />
      </div>
      {!!additionalServicesObj?.length && 
        <AdditionalServicesSection 
          additionalServices={additionalServicesObj} 
          selectedItems={selectedAddServices}
          setSelectedItems={setSelectedAddServices}
        />
      }
    </div>
  );
});

export default CartModalDeviceListItem;
