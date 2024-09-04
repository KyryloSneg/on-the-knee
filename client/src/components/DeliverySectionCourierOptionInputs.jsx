import "./styles/DeliverySectionCourierOptionInputs.css";
import { useEffect } from "react";
import Dropdown from "./UI/dropdown/Dropdown";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import _ from "lodash";
import { useWatch } from "react-hook-form";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS } from "../utils/consts";

const OPTIONS = Object.freeze([
  {
    id: 0,
    value: true,
    title: "Available elevator"
  },
  {
    id: 1,
    value: false,
    title: "Missing elevator"
  }
]);

// we have no need in hasElevator state because it doesn't have any initial value (=== null by default)
const DeliverySectionCourierOptionInputs = ({
  inputsId, register, errors, control, hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor,
}) => {
  const numberInputOptions = {
    validate: {
      isNotNegative: value => (+value >= 0 || value === "") || "Only a positive number or 0",
      // if value === "", Number.isInteger(+value) will return "0"
      isNotFloat: value => Number.isInteger(+value) || "Can't be a float number",
      isAppropriateLength: value => value.trim().length <= 5 || "Can't be more than 5 digits",
    }
  }

  // doing this to make changed fields be on the same place among other validations in the validate field 
  // (useful if we'll change the order at some point)
  let floorInputOptions = _.cloneDeep(numberInputOptions);
  let flatNumberInputOptions = _.cloneDeep(numberInputOptions);
  
  floorInputOptions.validate.isAppropriateLength = value => `${value}`.trim().length <= 2 || "Can't be more than 2 digits";
  floorInputOptions.validate.isNotNegative = value => (+value > 0 || value === "") || "Only a positive number";
  flatNumberInputOptions.validate.isNotNegative = value => (+value > 0 || value === "") || "Only a positive number";

  // we must define the values below only once
  const streetInputName = "street-" + inputsId;
  const houseNumberInputName = "houseNumber-" + inputsId;
  const flatNumberInputName = "flatNumber-" + inputsId;
  const floorInputName = "floor-" + inputsId;

  function onSelectCb(id) {
    const selectedOption = OPTIONS.find(option => option.id === id);
    
    // do not forget that our values' type is boolean one
    if (selectedOption?.value !== undefined) {
      setHasElevator(selectedOption.value);
    }
  }

  function onCheck() {
    if (isDisabled) return;
    setIsToLiftOnTheFloor(!isToLiftOnTheFloor);
  }

  const propsSelectedId = OPTIONS.find(option => option.value === hasElevator)?.id || null;

  const formValues = useWatch({ control });
  const areAllInputsFilled = 
    !!formValues[streetInputName] && !!formValues[houseNumberInputName] 
    && !!formValues[flatNumberInputName] && !!formValues[floorInputName];

  const isDisabled = !areAllInputsFilled || Object.keys(errors)?.length !== 0 || !hasElevator;

  let checkboxDivClassName = "checkbox-div";
  if (isToLiftOnTheFloor) {
    checkboxDivClassName += " checked";
  }

  useEffect(() => {
    if (isDisabled) setIsToLiftOnTheFloor(false);
  }, [isDisabled, setIsToLiftOnTheFloor]);

  return (
    <div className="delivery-section-courier-option-inputs">
      <div className="courier-option-inputs-top-row">
        <ReactHookFormInput
          labelText="Street"
          inputName={streetInputName}
          errors={errors}
          registerFnResult={register(streetInputName, {
            validate: {
              required: value => value.trim().length > 0 || "Required",
              isTooLong: value => value.trim().length <= 1000 || "Can't be more than 1000 characters",
              isEnglish: value => {
                return (/^[a-zA-Z0-9]+$/.test(value.trim()) && isNaN(+value.trim())) || "English chars with digits (or without) only";
              },
            }
          })}
          className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
        />
        <ReactHookFormInput
          labelText="House number"
          inputName={houseNumberInputName}
          errors={errors}
          type="number"
          registerFnResult={register(houseNumberInputName, {
            ...numberInputOptions,
            validate: {
              required: value => value.trim().length > 0 || "Required",
              ...numberInputOptions.validate,
            }
          })}
          className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
        />
        <ReactHookFormInput
          labelText="Flat number"
          inputName={flatNumberInputName}
          errors={errors}
          type="number"
          registerFnResult={register(flatNumberInputName, flatNumberInputOptions)}
          className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
        />
      </div>
      <div className="courier-option-inputs-bottom-row">
        <ReactHookFormInput
          labelText="Floor"
          inputName={floorInputName}
          errors={errors}
          type="number"
          registerFnResult={register(floorInputName, floorInputOptions)}
          className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
        />
        <Dropdown 
          options={OPTIONS} 
          propsSelectedId={propsSelectedId}
          // using this value to return to the value that was selected before the option unmount
          hasDefaultValue={hasElevator !== null} 
          placeHolder="Availability of the elevator"  
          onSelectCb={onSelectCb}
        />
      </div>
      <button 
        className="is-to-lift-on-the-floor-checkbox"
        type="button"
        role="checkbox"
        aria-checked={isToLiftOnTheFloor}
        onClick={onCheck}
        disabled={isDisabled}
      >
        <div className={checkboxDivClassName} />
        <span>To lift on the floor (+ 6$)</span>
      </button>
      {
        /* i won't implement message "We couldn't lift on the floor if there's no lift and any availability to do it, 
         * because order includes some really heavy devices", 
         * 'cause i haven't implemented weight category for devices 
         */
      }
    </div>
  );
}

export default DeliverySectionCourierOptionInputs;
