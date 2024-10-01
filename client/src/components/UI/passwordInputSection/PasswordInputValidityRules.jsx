import "./PasswordInputValidityRules.css";
import { PASSWORD_VALIDATION_MESSAGES_OBJ } from "../../../utils/inputOptionsConsts";
import isPasswordValidFunction from "../../../utils/isPasswordValidFunction";
import { useWatch } from "react-hook-form";
import fullfilledConditionIcon from "../../../assets/fullfilled-condition_00dd1d_20x20.svg";
import closeIcon from "../../../assets/close_a10e0e_20x20.svg";
import { lazy, Suspense } from "react";

const LazyImage = lazy(() => import("../lazyImage/LazyImage"));

// we must pass getValues, mustNotBeEqualToEmail and emailFieldName to show the corresponding validation
const PasswordInputValidityRules = ({ 
  control, passwordFieldName, mustNotBeEqualToEmail = false, 
  getValues = null, emailFieldName = null 
}) => {
  const formFields = useWatch({ control });
  
  const passwordValue = formFields?.[passwordFieldName];
  // we should show to user password requirements even before typing into the field
  // (the first render returns undefined, so return "" instead)
  const { isValidDetails } = isPasswordValidFunction(passwordValue || "", mustNotBeEqualToEmail, getValues, emailFieldName);

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
              <Suspense fallback={<div style={{ width: 20, height: 20 }} />}>
                <LazyImage src={src} alt={alt} draggable="false" />
              </Suspense>
              <p>{PASSWORD_VALIDATION_MESSAGES_OBJ[key]}</p>
            </div>
          </li>
        )
      })}
    </ul>
  );
}

export default PasswordInputValidityRules;
