import "./PasswordInputValidityRules.css";
import { PASSWORD_VALIDATION_MESSAGES_OBJ } from "../../../utils/inputOptionsConsts";
import fullfilledConditionIcon from "../../../assets/fullfilled-condition_00dd1d_20x20.svg";
import closeIcon from "../../../assets/close_a10e0e_20x20.svg";
import { useWatch } from "react-hook-form";
import isPasswordValidFunction from "utils/isPasswordValidFunction";

// if mustNotBeEqualToValuesObj has form field names as its keys, pass getValues 
const PasswordInputValidityRules = ({ 
  control, passwordFieldName, mustNotBeEqualToValuesObj = {}, getValues = null
}) => {
  const formFields = useWatch({ control });
  
  const passwordValue = formFields?.[passwordFieldName];
  // if isWithValidityRules === true,
  // we should show to user password requirements even before typing into the field
  // (the first render returns undefined, so return "" instead)
  const { 
    isValidDetails, 
  } = isPasswordValidFunction(passwordValue || "", mustNotBeEqualToValuesObj, getValues);

  return (
    <ul className="password-input-validity-rules">
      {Object.entries(isValidDetails).map(([key, isFullfilled]) => {
        const src = isFullfilled ? fullfilledConditionIcon : closeIcon;
        const alt = isFullfilled ? "Passed" : "Failed";
        
        let className = "password-input-validity-rule";
        if (!isFullfilled) {
          className += " invalid";
        }

        return (
          <li key={key}>
            <div className={className}>
              <img src={src} alt={alt} draggable="false" />
              <p>{PASSWORD_VALIDATION_MESSAGES_OBJ[key]}</p>
            </div>
          </li>
        )
      })}
    </ul>
  );
}

export default PasswordInputValidityRules;
