import "./styles/DeliverySectionCourierOptionInputs.css";
import { useEffect, useMemo } from "react";
import Dropdown from "./UI/dropdown/Dropdown";
import ReactHookFormInput from "./UI/reactHookFormInput/ReactHookFormInput";
import { useWatch } from "react-hook-form";
import { CHECKOUT_PAGE_INPUT_SERVICE_CLASS, TO_LIFT_ON_THE_FLOOR_PRICE } from "../utils/consts";
import { getNumberInputOptions, isEnglishWithOptionalDigits, REQUIRED_TEXT_INPUT_OPTIONS } from "../utils/inputOptionsConsts";
import _ from "lodash";

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
  inputsId, register, errors, trigger, control, hasElevator, setHasElevator, isToLiftOnTheFloor, setIsToLiftOnTheFloor,
}) => {
  const baseNumberInputOptions = getNumberInputOptions({ 
    isRequired: false,
    isNotNegative: true,
    isNotFloat: true,
    maxLength: 5
  });

  const floorInputOptions = getNumberInputOptions({ 
    isRequired: false,
    isNotNegativeOrZero: true,
    isNotFloat: true,
    maxLength: 2
  });

  const flatNumberInputOptions = getNumberInputOptions({ 
    isRequired: false,
    isNotNegativeOrZero: true,
    isNotFloat: true,
    maxLength: 5
  });

  const streetInputName = "street-" + inputsId;
  const houseNumberInputName = "houseNumber-" + inputsId;
  const flatNumberInputName = "flatNumber-" + inputsId;
  const floorInputName = "floor-" + inputsId;

  const streetInputRegisterOptions = useMemo(() => {
    let options = _.cloneDeep(REQUIRED_TEXT_INPUT_OPTIONS);

    delete options.validate.isOnlyLetters;
    options.validate.isEnglish = value => isEnglishWithOptionalDigits(value);

    return options;
  }, []);

  const streetInputRegisterResult = register(streetInputName, streetInputRegisterOptions);

  useEffect(() => {
    // trigger validation to show errors on inputs appear only if there are ones
    if (errors[streetInputName]) {
      trigger(streetInputName);
    }

    if (errors[houseNumberInputName]) {
      trigger(houseNumberInputName);
    }

    if (errors[flatNumberInputName]) {
      trigger(flatNumberInputName);
    }

    if (errors[floorInputName]) {
      trigger(floorInputName);
    }
    // eslint-disable-next-line
  }, []);

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

  const areThereTheInputsErrors = 
    !!errors?.streetInputName || !!errors?.houseNumberInputName 
    || !!errors?.flatNumberInputName || !!errors?.floorInputName;  

  const isDisabled = !areAllInputsFilled || areThereTheInputsErrors || !hasElevator;

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
          registerFnResult={streetInputRegisterResult}
          className={CHECKOUT_PAGE_INPUT_SERVICE_CLASS}
        />
        <ReactHookFormInput
          labelText="House number"
          inputName={houseNumberInputName}
          errors={errors}
          type="number"
          registerFnResult={register(houseNumberInputName, {
            ...baseNumberInputOptions,
            validate: {
              isRequired: value => `${value}`.trim().length > 0 || "Required",
              ...baseNumberInputOptions.validate,
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
        <span>To lift on the floor (+ {TO_LIFT_ON_THE_FLOOR_PRICE}$)</span>
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
