import "./ReactHookFormInput.css";
import { forwardRef } from "react";

const ReactHookFormInput = forwardRef(({ 
  labelText, inputName, errors, registerFnResult, 
  autoComplete = "off", isDisabled = false, isErrorCondition = null, 
  onChangeCaptureCb = null, ...props
}, ref) => {
  const isInvalid = isErrorCondition ? !!isErrorCondition : !!errors[inputName];

  let inputClassName = isInvalid ? "invalid" : "";
  if (props.className) {
    inputClassName += ` ${props.className}`;
    delete props.className;
  }

  return (
    <div className="react-hook-form-input">
      <label>
        {labelText}
        <input
          autoComplete={autoComplete}
          disabled={isDisabled}
          className={inputClassName}
          aria-invalid={isInvalid}
          onChangeCapture={(e) => onChangeCaptureCb?.(e)}
          ref={ref}
          {...registerFnResult}
          {...props}
        />
      </label>
      {isInvalid &&
        <p className="react-hook-form-input-error-msg" role="alert" aria-live="polite">
          {errors[inputName]?.message || "Error!"}
        </p>
      }
    </div>
  );
});

export default ReactHookFormInput;
