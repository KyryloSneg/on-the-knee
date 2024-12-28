import priceFilterOnKeyDown from '../../../utils/priceFilterOnKeyDown';
import validateMinMaxPrice from "../../../utils/validateMinMaxPrice";
import { useContext } from "react";
import { Context } from "../../../Context";
import { observer } from "mobx-react-lite";
import validateNumberInput from "../../../utils/validateNumberInput";
import findAddedCharAndIndex from '../../../utils/findAddedCharAndIndex';

const POSSIBLE_TYPES = ["default", "price"];
const NumberInput = observer(({ 
  type = "default", value, setValue, isValid, setIsValid, 
  minValue = -Infinity, isToUseNegativeIntegers = true, isToUseFloatNumbers = true, onSetValueCb = null, 
  isMin = null, minPriceValue = null, maxPriceValue = null, propsStoreToUse = null, ...props 
}) => {
  const { deviceStore } = useContext(Context);
  if (!POSSIBLE_TYPES.includes(type)) throw Error("type of Catalog Page is not defined or incorrect");

  let storeToUse = propsStoreToUse || deviceStore;

  function onChange(e) {
    const { addedChar } = findAddedCharAndIndex(value.toString(), e.target.value);
    const isValueNotValid = isNaN(e.target.value) 
    || (isToUseFloatNumbers ? false : addedChar === ".")
    || (isToUseNegativeIntegers ? false : e.target.value[0] === "-");

    let nextValue;
    if (isValueNotValid) {
      nextValue = value;
    } else if (e.target.value.length === 0 || e.target.value < minValue) {
      nextValue = minValue;
    } else {
      nextValue = e.target.value;
    }

    let nextIsValid = isValid;

    if (!isValueNotValid) {
      if (type === "price") {
        nextIsValid = validateMinMaxPrice(
          isMin,
          nextValue,
          storeToUse.initialMinPrice,
          storeToUse.initialMaxPrice,
          minPriceValue,
          maxPriceValue
        ).nextIsValid;
      } else if (type === "default") {
        nextIsValid = validateNumberInput(nextValue, minValue);
      }
    }

    setIsValid(nextIsValid);
    setValue(nextValue);

    if (onSetValueCb && !isValueNotValid) onSetValueCb();
  }

  let className = type !== "price" ? "number-input" : "";
  if (!isValid) {
    if (type !== "price") {
      className += " invalidInput";
    } else {
      className += "invalidInput";
    }
  }

  return (
    <input
      type="text"
      autoComplete="off"
      className={className}
      value={value}
      onChange={onChange}
      onKeyDown={(e) => {
        if (type === "price") {
          priceFilterOnKeyDown(
            e, type, value, setValue, setIsValid, minValue, onSetValueCb, isMin, 
            storeToUse.initialMinPrice, storeToUse.initialMaxPrice,
            minPriceValue, maxPriceValue, setIsValid, setValue
          );
        } else if (type === "default") {
          priceFilterOnKeyDown(e, type, value, setValue, setIsValid, minValue, onSetValueCb);
        }
      }}
      {...props}
    />
  );
});

export default NumberInput;
